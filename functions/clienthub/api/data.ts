// GET  /clienthub/api/data -> { rev, savedAt, data }   (data is null until the first save)
// PUT  /clienthub/api/data <- { rev, data }            -> { rev, savedAt }, or 409 + the current copy
//
// The whole Client Hub state is one JSON document in Cloudflare D1 (binding CLIENTHUB_DB).
// `rev` goes up by one on every save; a save based on an older rev is refused so one device can't
// silently overwrite changes made on another. The first save of each day also keeps a copy of the
// state as it was (table clienthub_backup, last 120 days).
// Authentication is done by functions/_middleware.ts.

interface D1Result {
  meta: { changes: number };
}
interface D1Stmt {
  bind(...v: unknown[]): D1Stmt;
  first<T>(): Promise<T | null>;
  run(): Promise<D1Result>;
}
interface D1 {
  prepare(sql: string): D1Stmt;
  batch(stmts: D1Stmt[]): Promise<D1Result[]>;
}
interface Env {
  CLIENTHUB_DB?: D1;
}
type Ctx = { request: Request; env: Env };
type Row = { rev: number; saved_at: string; data: string };

const MAX_BYTES = 5 * 1024 * 1024;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

let schemaReady = false;
async function db(env: Env): Promise<D1 | null> {
  const d = env.CLIENTHUB_DB;
  if (!d) return null;
  if (!schemaReady) {
    await d.batch([
      d.prepare(
        "CREATE TABLE IF NOT EXISTS clienthub_state (id INTEGER PRIMARY KEY CHECK (id = 1), rev INTEGER NOT NULL, saved_at TEXT NOT NULL, data TEXT NOT NULL)"
      ),
      d.prepare(
        "CREATE TABLE IF NOT EXISTS clienthub_backup (day TEXT PRIMARY KEY, rev INTEGER NOT NULL, saved_at TEXT NOT NULL, data TEXT NOT NULL)"
      ),
    ]);
    schemaReady = true;
  }
  return d;
}

const notConfigured = () =>
  json({ error: "storage-not-configured", detail: "Add a D1 binding named CLIENTHUB_DB." }, 503);

async function current(d: D1) {
  const row = await d.prepare("SELECT rev, saved_at, data FROM clienthub_state WHERE id = 1").first<Row>();
  return row
    ? { rev: row.rev, savedAt: row.saved_at, data: JSON.parse(row.data) }
    : { rev: 0, savedAt: null, data: null };
}

export const onRequestGet = async ({ env }: Ctx) => {
  const d = await db(env);
  if (!d) return notConfigured();
  return json(await current(d));
};

export const onRequestPut = async ({ request, env }: Ctx) => {
  const d = await db(env);
  if (!d) return notConfigured();

  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: "too-large" }, 413);
  let body: { rev?: unknown; data?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad-json" }, 400);
  }
  if (typeof body.rev !== "number" || typeof body.data !== "object" || body.data === null) {
    return json({ error: "bad-request" }, 400);
  }

  const now = new Date();
  const savedAt = now.toISOString();
  const day = savedAt.slice(0, 10);
  const cutoff = new Date(now.getTime() - 120 * 86400000).toISOString().slice(0, 10);
  const data = JSON.stringify(body.data);

  let changed: number;
  if (body.rev === 0) {
    const r = await d
      .prepare("INSERT INTO clienthub_state (id, rev, saved_at, data) VALUES (1, 1, ?, ?) ON CONFLICT(id) DO NOTHING")
      .bind(savedAt, data)
      .run();
    changed = r.meta.changes;
  } else {
    const [, , upd] = await d.batch([
      // keep the day's starting state, once per day
      d
        .prepare(
          "INSERT OR IGNORE INTO clienthub_backup (day, rev, saved_at, data) SELECT ?, rev, saved_at, data FROM clienthub_state WHERE id = 1"
        )
        .bind(day),
      d.prepare("DELETE FROM clienthub_backup WHERE day < ?").bind(cutoff),
      d
        .prepare("UPDATE clienthub_state SET rev = rev + 1, saved_at = ?, data = ? WHERE id = 1 AND rev = ?")
        .bind(savedAt, data, body.rev),
    ]);
    changed = upd.meta.changes;
  }

  if (changed !== 1) return json(await current(d), 409);
  return json({ rev: body.rev + 1, savedAt });
};
