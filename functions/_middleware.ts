// Cloudflare Pages middleware: password-protects everything under /clienthub (the page, its data API).
// public/_routes.json limits Functions to /clienthub*, so the rest of the site is served statically as before.
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
<style>
  :root{color-scheme:light dark;--bg:#f4f5f7;--card:#fff;--fg:#16181d;--muted:#666b76;--line:#d9dce2;--accent:#1f8a4c;--bad:#b42318}
  @media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#181b21;--fg:#eceef2;--muted:#9aa0ab;--line:#2c3038;--accent:#3cb371;--bad:#f97066}}
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);
  font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:16px}
  form{width:100%;max-width:340px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:28px}
  h1{margin:0 0 4px;font-size:20px}p{margin:0 0 20px;color:var(--muted);font-size:14px}
  label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
  input{width:100%;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:transparent;color:inherit}
  input:focus{outline:2px solid var(--accent);outline-offset:1px}
  button{margin-top:16px;width:100%;font:inherit;font-weight:600;padding:10px;border:0;border-radius:8px;background:var(--accent);color:#fff;cursor:pointer}
  .err{color:var(--bad);font-size:13px;margin:10px 0 0}
</style></head>
<body><form method="post" action="/clienthub/login">
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
  const protectedPath =
    path === "/clienthub" || path.startsWith("/clienthub/") || path.startsWith("/clienthub.");
  if (!protectedPath) return ctx.next();

  const all = logins(ctx.env);
  const tokens = await Promise.all(all.map(sessionToken));
  const secure = url.protocol === "https:" ? "; Secure" : "";

  if (path === "/clienthub/login") {
    if (ctx.request.method !== "POST") return redirect("/clienthub");
    const form = await ctx.request.formData().catch(() => null);
    const given = String(form?.get("password") ?? "");
    const i = all.findIndex((l) => safeEqual(l.password, given));
    if (i < 0) return loginPage(true);
    return redirect(
      "/clienthub",
      `${COOKIE}=${tokens[i]}; Path=/; Max-Age=${YEAR}; HttpOnly; SameSite=Lax${secure}`
    );
  }

  if (path === "/clienthub/logout") {
    return redirect("/clienthub", `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`);
  }

  const cookie = readCookie(ctx.request, COOKIE);
  const who = tokens.findIndex((t) => safeEqual(cookie, t));
  if (who >= 0) ctx.data.session = all[who].session;
  else {
    if (path.startsWith("/clienthub/api/")) {
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
