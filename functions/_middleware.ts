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
<link rel="preload" as="image" href="/tools/hub-logo-v3.png"><link rel="icon" type="image/png" href="/tools/hub-logo-v3.png"><link rel="apple-touch-icon" href="/tools/hub-logo-v3.png">
<meta property="og:type" content="website"><meta property="og:title" content="Client Hub"><meta property="og:description" content="VirtuallyAnything">
<meta property="og:image" content="https://lukeconstable.com/tools/hub-og-v3.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<style>
  /* Colours from lukeconstable.com's dark menus: black page, gray-950 panel, yellow-700 border (yellow-600 on hover). */
  :root{color-scheme:dark;--bg:#000;--card:#030712;--fg:#fff;--muted:#9ca3af;--line:#1f2937;--field:#111827;
    --gold:#a16207;--gold-hi:#ca8a04;--bad:#f87171}
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);
  font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:16px}
  form{width:100%;max-width:340px;background:var(--card);border:2px solid var(--gold);border-radius:14px;padding:2px;
    box-shadow:0 20px 25px -5px rgba(0,0,0,.2),0 8px 10px -6px rgba(0,0,0,.2);transition:border-color .3s}
  /* the inset window with thin blue pinstripes, as on lukeconstable.com (gray-900 with .vLines over it) */
  .window{position:relative;border-radius:10px;padding:22px 16px 16px;background:#101828 repeating-linear-gradient(to right,
    rgba(1,1,1,0) 0,rgba(1,1,1,0) 2px,rgb(1,1,1) 2px,rgb(1,1,1) 3px)}
  .head{display:flex;align-items:center;justify-content:center;gap:10px;margin:0}
  .head+p{text-align:center;margin-top:8px}
  .social{position:absolute;top:5px;right:7px;display:flex}
  .social a{display:grid;place-items:center;width:20px;height:24px;color:#6b7280;border-radius:6px;transition:transform .15s,color .15s}
  .social a:hover{color:var(--gold-hi);transform:scale(1.1)}
  .social a:focus-visible{outline:2px solid var(--gold-hi)}
  form:hover,form:focus-within{border-color:var(--gold-hi)}
  h1{margin:0 0 4px;font-size:20px}p{margin:0 0 14px;color:var(--muted);font-size:14px}
  label{display:block;font-size:13px;font-weight:600;margin-bottom:3px;color:#e5e7eb}
  input{width:100%;font:inherit;font-size:16px;line-height:22px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:#000;color:inherit}
  .masked{-webkit-text-security:disc}
  input:focus{outline:2px solid var(--gold-hi);outline-offset:1px;border-color:transparent}
  button{margin-top:12px;width:100%;font:inherit;font-weight:600;line-height:22px;padding:8px;border:2px solid var(--gold);border-radius:8px;
    background:var(--field);color:var(--gold-hi);cursor:pointer;transition:border-color .2s,background .2s,color .2s}
  button:hover{border-color:var(--gold-hi);background:var(--gold-hi);color:#000}
  button:focus-visible{outline:2px solid var(--gold-hi);outline-offset:2px}
  .err{color:var(--bad);font-size:13px;margin:6px 0 0}
</style></head>
<body><form method="post" action="/tools/clienthub/login"><div class="window">
  <nav class="social">
    <a href="https://www.instagram.com/virtuallyanything.xyz/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" aria-hidden="true" height="15" width="15" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg></a>
    <a href="https://www.linkedin.com/in/lukeconstable/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" aria-hidden="true" height="13" width="13" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"></path></svg></a>
    <a href="mailto:luke@lukeconstable.com" aria-label="Email" title="Email luke@lukeconstable.com"><svg viewBox="0 0 448 448" width="13.1" height="13.1" fill="none" stroke="currentColor" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="20" y="20" width="408" height="408" rx="96"/><path d="M100 150l124 104 124-104"/></svg></a>
  </nav>
  <div class="head">
    <img src="/tools/hub-logo-v3.png" alt="" width="32" height="32" style="display:block;flex:none;image-rendering:pixelated">
    <h1 style="margin:0;line-height:1;white-space:nowrap">Client Hub</h1>
  </div><p>VirtuallyAnything</p>
  <label for="pw">Password</label>
  <input id="pw" class="masked" name="key" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" data-1p-ignore data-lpignore="true" data-bwignore autofocus required>
  <script>if(!CSS.supports("-webkit-text-security","disc"))document.getElementById("pw").type="password"</script>
  ${failed ? '<p class="err">Sorry, wrong password.</p>' : ""}
  <button type="submit">Sign in</button>
</div></form></body></html>`;
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
    const given = String(form?.get("key") ?? form?.get("password") ?? "");
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
