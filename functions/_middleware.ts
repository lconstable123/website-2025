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

// The Virtually Anything badge (same artwork as virtuallyanything.xyz/icon.svg).
const VA_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#264653"/>' +
  '<circle cx="392" cy="128" r="22" fill="#f2e8cf" opacity="0.9"/><ellipse cx="256" cy="420" rx="190" ry="44" fill="#2a9d8f"/>' +
  '<rect x="186" y="176" width="140" height="236" rx="70" fill="#e76f51"/><circle cx="230" cy="250" r="12" fill="#264653"/>' +
  '<circle cx="282" cy="250" r="12" fill="#264653"/><path d="M232 292 q24 20 48 0" stroke="#264653" stroke-width="9" fill="none" stroke-linecap="round"/></svg>';

const noStore = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function loginPage(failed: boolean): Response {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#000000"><meta name="robots" content="noindex,nofollow">
<title>Client Hub · Virtually Anything</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(VA_ICON)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root{--ink:#000;--copper:#6b4a2b;--copper-hi:#b07d4a;--cream:#f2ead8;--muted:#a9b0b8;--coral:#e8735a;color-scheme:dark}
  *{box-sizing:border-box}html,body{margin:0;min-height:100%}
  body{min-height:100dvh;background:var(--ink);color:var(--cream);font-family:Montserrat,system-ui,-apple-system,"Segoe UI",sans-serif}
  .wrap{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;
    padding:48px 28px calc(48px + env(safe-area-inset-bottom))}
  .panel{width:min(100%,440px);padding:6px;border-radius:20px;border:2px solid var(--copper);background:#000}
  .inner{border-radius:14px;border:1px solid rgba(176,125,74,.25);padding:28px 24px;text-align:center}
  .badge{width:52px;height:52px;border-radius:50%;display:block;margin:0 auto 18px;box-shadow:0 0 0 2px var(--cream),0 0 0 4px var(--copper)}
  h1{margin:0;font-weight:700;font-size:clamp(20px,5vw,28px);letter-spacing:.24em;text-indent:.24em;text-transform:uppercase}
  .tag{margin:8px 0 0;font-size:15px;font-weight:500;letter-spacing:.04em;color:var(--muted)}
  .rule{height:1px;border:0;margin:20px auto;background:linear-gradient(90deg,transparent,rgba(176,125,74,.6),transparent)}
  label{display:block;text-align:left;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  input{width:100%;font:inherit;font-size:16px;min-height:46px;padding:10px 14px;border:1.5px solid rgba(242,234,216,.5);border-radius:8px;
    background:transparent;color:var(--cream);transition:border-color .15s}
  input:focus{outline:none;border-color:var(--copper-hi);box-shadow:0 0 0 3px rgba(176,125,74,.25)}
  button{margin-top:16px;width:100%;min-height:52px;font:inherit;font-size:16px;font-weight:700;letter-spacing:.06em;color:var(--cream);
    border:1.5px solid var(--copper-hi);border-radius:8px;background:rgba(176,125,74,.12);cursor:pointer;
    transition:background .15s,color .15s,transform .15s}
  button:hover{background:var(--copper-hi);color:var(--ink);transform:translateY(-1px)}
  button:focus-visible{outline:2px solid var(--copper-hi);outline-offset:3px}
  .err{margin:12px 0 0;font-size:13px;color:var(--coral);text-align:left}
  footer{font-size:12px;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;opacity:.8}
  footer a{color:inherit;text-decoration:none}footer a:hover{color:var(--cream)}
  @media (max-width:480px){.wrap{padding:36px 18px calc(36px + env(safe-area-inset-bottom));gap:20px}.inner{padding:24px 16px}}
</style></head>
<body><div class="wrap">
  <main class="panel"><form class="inner" method="post" action="/clienthub/login">
    <img class="badge" alt="" width="52" height="52" src="data:image/svg+xml,${encodeURIComponent(VA_ICON)}">
    <h1>Client Hub</h1>
    <p class="tag">Virtually Anything timesheets</p>
    <hr class="rule">
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
    ${failed ? '<p class="err">That password isn\'t right.</p>' : ""}
    <button type="submit">Sign in</button>
  </form></main>
  <footer><a href="https://virtuallyanything.xyz/">virtuallyanything.xyz</a></footer>
</div></body></html>`;
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
