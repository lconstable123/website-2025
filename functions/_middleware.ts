// Cloudflare Pages middleware: password-protects everything under /tools/clienthub (the page, its data API).
// The old /clienthub address redirects (308) to /tools/clienthub so bookmarks and shared links keep working.
// public/_routes.json limits Functions to /tools/clienthub* (and the old /clienthub* redirect), so the rest of the site is served statically as before.
//
// Two kinds of login:
//  - owner: full editing. Password = CLIENTHUB_PASSWORD env var, default "va".
//  - read-only client viewers: see only their own days, billing periods and expenses.
//    CLIENTHUB_VIEWERS env var, entries separated by ";", each  password:client name|other name:Display name
//    default "lr:LR|Lucky Robots|LuckyRobots:Lucky Robots".
// The role is handed to the API in ctx.data.session.

interface Env {
  CLIENTHUB_PASSWORD?: string;
  CLIENTHUB_VIEWERS?: string;
}

export type Session = { role: "owner" } | { role: "viewer"; id: string; display: string; clients: string[] };

type Ctx = { request: Request; env: Env; next: () => Promise<Response>; data: Record<string, unknown> };

const COOKIE = "clienthub_session";
const YEAR = 60 * 60 * 24 * 365;
const DEFAULT_VIEWERS = "lr:LR|Lucky Robots|LuckyRobots:Lucky Robots";

type Login = { password: string; session: Session };

function logins(env: Env): Login[] {
  const list: Login[] = [{ password: env.CLIENTHUB_PASSWORD || "va", session: { role: "owner" } }];
  for (const part of (env.CLIENTHUB_VIEWERS ?? DEFAULT_VIEWERS).split(";")) {
    const [password, names, display] = part.split(":").map((x) => (x ?? "").trim());
    if (!password || !names) continue;
    const clients = names.split("|").map((x) => x.trim()).filter(Boolean);
    list.push({ password, session: { role: "viewer", id: password, display: display || clients[0], clients } });
  }
  return list;
}

async function sessionToken(l: Login): Promise<string> {
  const who = l.session.role === "owner" ? "owner" : "viewer:" + l.session.id;
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("clienthub-session:v2:" + who + ":" + l.password)
  );
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(req: Request, name: string): string {
  for (const part of (req.headers.get("Cookie") || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return "";
}

const noStore = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function loginPage(failed: boolean): Response {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Client Hub</title>
<link rel="icon" type="image/png" href="/tools/hub-logo.png"><link rel="apple-touch-icon" href="/tools/hub-logo.png">
<meta property="og:type" content="website"><meta property="og:title" content="Client Hub"><meta property="og:description" content="VirtuallyAnything Timesheet">
<meta property="og:image" content="https://lukeconstable.com/tools/hub-og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<style>
  /* Colours from lukeconstable.com's dark menus: black page, gray-950 panel, yellow-700 border (yellow-600 on hover). */
  :root{color-scheme:dark;--bg:#000;--card:#030712;--fg:#fff;--muted:#9ca3af;--line:#1f2937;--field:#111827;
    --gold:#a16207;--gold-hi:#ca8a04;--bad:#f87171}
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);
  font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:16px}
  form{width:100%;max-width:340px;background:var(--card);border:2px solid var(--gold);border-radius:12px;padding:28px;
    box-shadow:0 20px 25px -5px rgba(0,0,0,.2),0 8px 10px -6px rgba(0,0,0,.2);transition:border-color .3s}
  form:hover,form:focus-within{border-color:var(--gold-hi)}
  h1{margin:0 0 4px;font-size:20px}p{margin:0 0 20px;color:var(--muted);font-size:14px}
  label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#e5e7eb}
  input{width:100%;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:#000;color:inherit}
  input:focus{outline:2px solid var(--gold-hi);outline-offset:1px;border-color:transparent}
  button{margin-top:16px;width:100%;font:inherit;font-weight:600;padding:10px;border:2px solid var(--gold);border-radius:8px;
    background:var(--field);color:var(--gold-hi);cursor:pointer;transition:border-color .2s,background .2s,color .2s}
  button:hover{border-color:var(--gold-hi);background:var(--gold-hi);color:#000}
  button:focus-visible{outline:2px solid var(--gold-hi);outline-offset:2px}
  .err{color:var(--bad);font-size:13px;margin:10px 0 0}
</style></head>
<body><form method="post" action="/tools/clienthub/login">
  <img src="/tools/hub-logo.png" alt="" width="96" height="96" style="display:block;margin:0 0 12px;image-rendering:pixelated">
  <h1>Client Hub</h1><p>VirtuallyAnything Timesheet</p>
  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
  ${failed ? '<p class="err">That password isn\'t right.</p>' : ""}
  <button type="submit">Sign in</button>
</form></body></html>`;
  return new Response(html, {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8", ...noStore },
  });
}

function redirect(to: string, cookie?: string): Response {
  const headers: Record<string, string> = { Location: to, ...noStore };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(null, { status: 303, headers });
}

export const onRequest = async (ctx: Ctx): Promise<Response> => {
  const url = new URL(ctx.request.url);
  const path = url.pathname;
  // old address -> new address (308 keeps the method, so a login POST or API PUT is not broken)
  if (path === "/clienthub" || path.startsWith("/clienthub/") || path.startsWith("/clienthub.")) {
    return new Response(null, { status: 308, headers: { Location: "/tools" + path + url.search, ...noStore } });
  }
  const protectedPath =
    path === "/tools/clienthub" || path.startsWith("/tools/clienthub/") || path.startsWith("/tools/clienthub.");
  if (!protectedPath) return ctx.next();

  const all = logins(ctx.env);
  const tokens = await Promise.all(all.map(sessionToken));
  const secure = url.protocol === "https:" ? "; Secure" : "";

  if (path === "/tools/clienthub/login") {
    if (ctx.request.method !== "POST") return redirect("/tools/clienthub");
    const form = await ctx.request.formData().catch(() => null);
    const given = String(form?.get("password") ?? "");
    const i = all.findIndex((l) => safeEqual(l.password, given));
    if (i < 0) return loginPage(true);
    return redirect(
      "/tools/clienthub",
      `${COOKIE}=${tokens[i]}; Path=/; Max-Age=${YEAR}; HttpOnly; SameSite=Lax${secure}`
    );
  }

  if (path === "/tools/clienthub/logout") {
    return redirect("/tools/clienthub", `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`);
  }

  const cookie = readCookie(ctx.request, COOKIE);
  const who = tokens.findIndex((t) => safeEqual(cookie, t));
  if (who >= 0) ctx.data.session = all[who].session;
  else {
    if (path.startsWith("/tools/clienthub/api/")) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...noStore },
      });
    }
    return loginPage(false);
  }

  const res = await ctx.next();
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(noStore)) out.headers.set(k, v);
  return out;
};
