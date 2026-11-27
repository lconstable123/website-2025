// Client Hub data model and rules - a port of the VirtuallyAnything Timesheet desktop app (LuckyTime, Timesheet.cs).
// Dates are ISO strings (yyyy-mm-dd); clock times are minutes after midnight.

export type Entry = {
  id: string;
  date: string;
  on: number | null;
  off: number | null;
  note: string;
  client: string; // typed for this day; blank = use the billing period's client
  ot: number | null; // overtime typed by the user; replaces the automatic weekday/weekend rule
};

export type Period = {
  id: string;
  from: string;
  to: string;
  hours: number; // hours to bill for the period
  paid: boolean;
  otPaid: boolean; // overtime paid; without paid, hours comes out of the overtime pool
  client: string;
};

export type Expense = {
  id: string;
  date: string;
  item: string;
  company: string;
  use: string; // what the expense was for
  price: number;
  paid: boolean;
  client: string; // who the expense is for; tagged expenses show in that client's read-only view
};

export type State = {
  version: 1;
  fullDayHours: number; // a full day, including lunch
  entries: Entry[];
  periods: Period[];
  expenses: Expense[];
  clientHues: Record<string, number>; // lower-cased client name -> hue 0-359
};

export const emptyState = (): State => ({
  version: 1,
  fullDayHours: 8,
  entries: [],
  periods: [],
  expenses: [],
  clientHues: {},
});

/** Fills in anything missing from a stored/imported document. */
export function normalizeState(raw: unknown): State {
  const s = (raw && typeof raw === "object" ? raw : {}) as Partial<State>;
  const fd = Number(s.fullDayHours);
  return {
    version: 1,
    fullDayHours: fd > 0 && fd <= 24 ? fd : 8,
    entries: Array.isArray(s.entries) ? s.entries : [],
    // data saved before there was "OT paid": Paid covered the overtime too
    periods: Array.isArray(s.periods) ? s.periods.map((p) => ({ ...p, otPaid: p.otPaid ?? p.paid })) : [],
    expenses: Array.isArray(s.expenses) ? s.expenses.map((x) => ({ ...x, client: x.client ?? "" })) : [],
    clientHues: s.clientHues && typeof s.clientHues === "object" ? s.clientHues : {},
  };
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------- numbers ----------

export const round2 = (v: number) => Math.round(v * 100) / 100;
const z = (v: number) => (Math.abs(v) < 0.005 ? 0 : v); // no "-0.00"
export const fix2 = (v: number) => z(v).toFixed(2);
export const fmtHours = (h: number | null | undefined) => (h == null ? "" : fix2(h));
export const fmtMoney = (v: number) => "$" + fix2(v);
/** "0.##" */
export const fmtShort = (v: number) => String(Number(z(v).toFixed(2)));

export function parseNumber(s: string): number | null {
  const t = s.trim();
  if (!t || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** "$1,234.50", "12.5" -> number */
export function parseMoney(s: string): number | null {
  return parseNumber(s.replace(/\$/g, "").replace(/,/g, ""));
}

// ---------- dates ----------

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");

function utc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function isoOf(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
function makeIso(y: number, m: number, d: number): string | null {
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return isoOf(dt);
}

export function todayIso(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
export const addDays = (iso: string, n: number) => isoOf(new Date(utc(iso).getTime() + n * 86400000));
export const dayOfWeek = (iso: string) => utc(iso).getUTCDay();
export const isWeekend = (iso: string) => {
  const d = dayOfWeek(iso);
  return d === 0 || d === 6;
};
/** "Thu 19/11/26" */
export function fmtDate(iso: string): string {
  const d = utc(iso);
  return `${DAYS[d.getUTCDay()]} ${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCFullYear() % 100)}`;
}
/** "19/11/26" */
export function fmtDateShort(iso: string): string {
  return fmtDate(iso).slice(4);
}

export function weekdays(from: string, to: string): number {
  let n = 0;
  for (let d = from; d <= to; d = addDays(d, 1)) if (!isWeekend(d)) n++;
  return n;
}

/** Accepts "Thu 19/11/26", "2026-11-19", "19/11/26", "19/11/2026", "19-11-26", "19/11" (this year). */
export function parseDate(s: string): string | null {
  let t = s.trim();
  if (!t) return null;
  t = t.replace(/^[A-Za-z]{3,}\.?,?\s+/, "");
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ].*)?$/.exec(t);
  if (m) return makeIso(+m[1], +m[2], +m[3]);
  m = /^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2}|\d{4}))?$/.exec(t);
  if (m) {
    let y = m[3] ? +m[3] : new Date().getFullYear();
    if (m[3] && m[3].length === 2) y += 2000;
    return makeIso(y, +m[2], +m[1]);
  }
  return null;
}

/**
 * Resolves what was typed in a Date cell. If only the day name was changed ("Thu 19/11/26" -> "Fri 19/11/26")
 * the date moves to the nearest such weekday, so DD follows the day name. Otherwise the typed date wins.
 */
export function resolveDate(text: string, old: string | null): string | null {
  const t = text.trim();
  const m = /^([A-Za-z]{3})[A-Za-z]*\.?,?\s+(.+)$/.exec(t);
  if (m) {
    const dow = DAYS.findIndex((n) => n.toLowerCase() === m[1].toLowerCase());
    const rest = parseDate(m[2]);
    if (dow >= 0 && rest) {
      if (old && rest === old && dayOfWeek(rest) !== dow) {
        let diff = dow - dayOfWeek(old);
        if (diff > 3) diff -= 7;
        if (diff < -3) diff += 7;
        return addDays(old, diff);
      }
      return rest;
    }
  }
  return parseDate(t);
}

// ---------- times ----------

/** minutes -> "8:30 AM" */
export function fmtTime(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
}

/** "830", "8:30", "8:30 am", "5pm", "17:05" -> minutes */
export function parseTime(s: string): number | null {
  const t = s.trim().toLowerCase();
  if (!t) return null;
  if (/^\d{1,4}$/.test(t)) {
    const v = +t;
    const h = t.length <= 2 ? v : Math.floor(v / 100);
    const m = t.length <= 2 ? 0 : v % 100;
    return h > 23 || m > 59 ? null : h * 60 + m;
  }
  const m = /^(\d{1,2})(?:[:.](\d{2}))?(?::\d{2})?\s*(a|p)?\.?\s*(?:m\.?)?$/.exec(t);
  if (!m) return null;
  let h = +m[1];
  const mm = m[2] ? +m[2] : 0;
  if (mm > 59) return null;
  if (m[3]) {
    if (h < 1 || h > 12) return null;
    if (h === 12) h = 0;
    if (m[3] === "p") h += 12;
  } else if (!m[2] || h > 23) return null;
  return h * 60 + mm;
}

// ---------- timesheet rules ----------

export type Row = Entry & {
  worked: number | null; // time between Clock On and Clock Off
  hours: number | null; // regular hours = worked - overtime
  overtime: number | null; // the day's overtime, on the day's last row
};

export function worked(e: Pick<Entry, "on" | "off">): number | null {
  if (e.on != null && e.off != null && e.off >= e.on) return round2((e.off - e.on) / 60);
  return null;
}

export function sortEntries<T extends Entry>(list: T[]): T[] {
  return [...list].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.on ?? 0) - (b.on ?? 0)));
}

/**
 * Works out Hours (regular) and Overtime for every row. Overtime is per day and shown on the day's last row:
 * weekdays = (time worked) - full day, weekends = all time worked - unless an overtime figure was typed,
 * which wins. Hours = worked - overtime, so Hours + Overtime = worked.
 */
export function annotate(entries: Entry[], fullDay: number): Row[] {
  const rows: Row[] = sortEntries(entries).map((e) => ({ ...e, worked: worked(e), hours: null, overtime: null }));
  const byDate = new Map<string, Row[]>();
  for (const r of rows) {
    const g = byDate.get(r.date);
    if (g) g.push(r);
    else byDate.set(r.date, [r]);
  }
  for (const [date, g] of byDate) {
    const w = g.filter((x) => x.worked != null);
    if (w.length === 0) continue;
    const total = w.reduce((a, x) => a + (x.worked as number), 0);
    let ot = isWeekend(date) ? total : Math.max(0, total - fullDay);
    const ov = [...w].reverse().find((x) => x.ot != null);
    if (ov) ot = Math.min(Math.max(0, ov.ot as number), total);
    w[w.length - 1].overtime = round2(ot);
    let remaining = ot;
    for (let i = w.length - 1; i >= 0; i--) {
      const wk = w[i].worked as number;
      const take = Math.min(remaining, wk);
      w[i].hours = round2(wk - take);
      remaining -= take;
    }
  }
  return rows;
}

export function dayWorked(rows: Row[], date: string): number {
  return rows.filter((r) => r.date === date).reduce((a, r) => a + (r.worked ?? 0), 0);
}

// ---------- clients ----------

export const byFrom = (a: Period, b: Period) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0);
export const sortPeriods = (p: Period[]) => [...p].sort(byFrom);
export const sortExpenses = (x: Expense[]) => [...x].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

/** The client for a date is the one on the billing period that covers it. */
export function clientFor(date: string, periods: Period[]): string {
  const p = sortPeriods(periods).find((x) => x.client && date >= x.from && date <= x.to);
  return p ? p.client : "";
}

export function knownClients(s: State): string[] {
  const seen = new Map<string, string>();
  for (const n of [
    ...s.periods.map((p) => p.client),
    ...s.entries.map((e) => e.client),
    ...s.expenses.map((x) => x.client),
  ]) {
    const t = (n || "").trim();
    if (t && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

/** Every client gets a random hue the first time it's seen, kept well apart from the other clients' hues. */
export function ensureHues(s: State): State {
  const missing = knownClients(s).filter((n) => s.clientHues[n.toLowerCase()] == null);
  if (missing.length === 0) return s;
  const hues = { ...s.clientHues };
  for (const name of missing) {
    let best = Math.floor(Math.random() * 360);
    let bestGap = -1;
    for (let i = 0; i < 24; i++) {
      const cand = Math.floor(Math.random() * 360);
      let gap = 360;
      for (const used of Object.values(hues)) {
        const dd = Math.abs(cand - used);
        gap = Math.min(gap, dd, 360 - dd);
      }
      if (gap > bestGap) {
        bestGap = gap;
        best = cand;
      }
    }
    hues[name.toLowerCase()] = best;
  }
  return { ...s, clientHues: hues };
}

function hueFor(name: string, hues: Record<string, number>): number {
  const h = hues[name.toLowerCase()];
  if (h != null) return h;
  let x = 0;
  for (const c of name.toLowerCase()) x = (x * 31 + c.charCodeAt(0)) % 360;
  return x;
}

/** A pastel colour per client, as [r, g, b] (same formula as the desktop app). */
export function clientRgb(name: string, hues: Record<string, number>): [number, number, number] {
  const hue = hueFor(name, hues) / 60;
  const s = 0.55,
    l = 0.8;
  const q = l + s - l * s,
    p = 2 * l - q;
  const ch = (t: number) => {
    if (t < 0) t += 6;
    if (t >= 6) t -= 6;
    if (t < 1) return p + (q - p) * t;
    if (t < 3) return q;
    if (t < 4) return p + (q - p) * (4 - t);
    return p;
  };
  return [Math.floor(ch(hue + 2) * 255), Math.floor(ch(hue) * 255), Math.floor(ch(hue - 2) * 255)];
}

export const clientCss = (name: string, hues: Record<string, number>) => `rgb(${clientRgb(name, hues).join(",")})`;

// ---------- billing / summary ----------

const sameClient = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** An expense counts towards a billing period when it's dated inside it and isn't tagged for a different client. */
export function expenseInPeriod(x: Expense, p: Period): boolean {
  return x.date >= p.from && x.date <= p.to && (!x.client || !p.client || sameClient(x.client, p.client));
}

/**
 * What a client sees in read-only mode: only their days (typed on the day, or from the billing period), their
 * billing periods and expenses tagged for them. Done on the server, so other clients' data is never sent.
 * On a day shared with another client, the overtime is fixed to this client's share of the day's overtime.
 */
export function filterForClient(s: State, names: string[]): State {
  const is = (n: string) => !!n && names.some((m) => sameClient(m, n));
  const all = annotate(s.entries, s.fullDayHours);
  const kept = all.filter((r) => is(r.client || clientFor(r.date, s.periods)));
  const entries: Entry[] = [];
  for (const date of [...new Set(kept.map((r) => r.date))]) {
    const mine = kept.filter((r) => r.date === date);
    const mixed = all.filter((r) => r.date === date).length !== mine.length;
    const out: Entry[] = mine.map(({ worked: _w, hours: _h, overtime: _o, ...e }) => ({ ...e, ot: mixed ? null : e.ot }));
    if (mixed) {
      const share = mine.reduce((a, r) => a + (r.worked != null ? r.worked - (r.hours ?? 0) : 0), 0);
      const lastWorked = [...mine].reverse().find((r) => r.worked != null);
      if (lastWorked) out.find((e) => e.id === lastWorked.id)!.ot = round2(share);
    }
    entries.push(...out);
  }
  const hues: Record<string, number> = {};
  for (const [k, v] of Object.entries(s.clientHues)) if (is(k)) hues[k] = v;
  return {
    ...s,
    entries,
    periods: s.periods.filter((p) => is(p.client)),
    expenses: s.expenses.filter((x) => is(x.client)),
    clientHues: hues,
  };
}

export type PeriodStats = { reg: number; ot: number; worked: number; expenses: number; remaining: number | null };

export function periodStats(p: Period, rows: Row[], expenses: Expense[]): PeriodStats {
  const inP = rows.filter((x) => x.date >= p.from && x.date <= p.to);
  const reg = inP.reduce((a, x) => a + (x.hours ?? 0), 0);
  const ot = inP.reduce((a, x) => a + (x.overtime ?? 0), 0);
  const exp = expenses.filter((x) => expenseInPeriod(x, p)).reduce((a, x) => a + x.price, 0);
  return { reg, ot, worked: reg + ot, expenses: exp, remaining: p.hours > 0 ? p.hours - reg - ot : null };
}

export type Summary = {
  totalH: number;
  totalO: number;
  claimedH: number;
  claimedO: number;
  claimedX: number;
  outX: number;
};

/**
 * "Claimed" = regular hours of days inside a billing period marked Paid, overtime of days inside a period marked
 * both Paid and OT paid, plus expenses marked Paid. A period marked OT paid but not Paid claims its "hours to bill"
 * from the overtime pool instead. Outstanding = the rest. Overtime is shown as time in lieu.
 */
export function summaryFigures(rows: Row[], s: State): Summary {
  const paid = s.periods.filter((p) => p.paid);
  const daysIn = (periods: Period[]) => rows.filter((d) => periods.some((p) => d.date >= p.from && d.date <= p.to));
  const payouts = s.periods.filter((p) => p.otPaid && !p.paid);
  const sum = (l: Row[], k: "hours" | "overtime") => l.reduce((a, x) => a + (x[k] ?? 0), 0);
  return {
    totalH: sum(rows, "hours"),
    totalO: sum(rows, "overtime"),
    claimedH: sum(daysIn(paid), "hours"),
    claimedO: sum(daysIn(paid.filter((p) => p.otPaid)), "overtime") + payouts.reduce((a, p) => a + p.hours, 0),
    claimedX: s.expenses.filter((x) => x.paid).reduce((a, x) => a + x.price, 0),
    outX: s.expenses.filter((x) => !x.paid).reduce((a, x) => a + x.price, 0),
  };
}

/** "12.00 h (1.5 days)" */
export function lieuText(hours: number, fullDay: number): string {
  const days = hours / fullDay;
  return `${fix2(hours)} h (${fmtShort(days)} ${Math.abs(days - 1) < 0.005 ? "day" : "days"})`;
}

// ---------- clock on / off ----------

export const nowMinutes = (now = new Date()) => now.getHours() * 60 + now.getMinutes();

function lastToday(s: State, today: string): Entry | undefined {
  return sortEntries(s.entries.filter((e) => e.date === today)).pop();
}

export type ClockStatus = { on: boolean; since: number | null; live: number; todayWorked: number; todayOt: number };

export function clockStatus(s: State, now = new Date()): ClockStatus {
  const today = todayIso(now);
  const e = lastToday(s, today);
  const on = !!e && e.on != null && e.off == null;
  const rows = annotate(s.entries.filter((x) => x.date === today), s.fullDayHours);
  return {
    on,
    since: on ? (e!.on as number) : null,
    live: on ? Math.max(0, (nowMinutes(now) - (e!.on as number)) / 60) : 0,
    todayWorked: rows.reduce((a, x) => a + (x.worked ?? 0), 0),
    todayOt: rows.reduce((a, x) => a + (x.overtime ?? 0), 0),
  };
}

/** Clock on, or off, at the current minute. Clocking on again later the same day resumes that day's entry. */
export function toggleClock(s: State, now = new Date()): { state: State; title: string; body: string } {
  const today = todayIso(now);
  const t = nowMinutes(now);
  const e = lastToday(s, today);
  const on = !!e && e.on != null && e.off == null;
  let entries: Entry[];
  if (on) {
    entries = s.entries.map((x) => (x.id === e!.id ? { ...x, off: Math.max(t, x.on as number), ot: null } : x));
    const st = { ...s, entries };
    const saved = annotate(st.entries.filter((x) => x.date === today), s.fullDayHours).find((x) => x.id === e!.id);
    const ot = saved?.overtime ?? 0;
    return {
      state: st,
      title: `Clocked OFF at ${fmtTime(t)}`,
      body: `Today: ${fmtHours(saved?.worked)} h${ot > 0 ? `, overtime ${fmtHours(ot)} h` : ""}`,
    };
  }
  let body = "Have a good day.";
  if (!e) entries = [...s.entries, { id: uid(), date: today, on: t, off: null, note: "", client: "", ot: null }];
  else if (e.on == null) entries = s.entries.map((x) => (x.id === e.id ? { ...x, on: t } : x));
  else {
    // clocked off earlier today: carry on the same entry (lunch is included in the full day)
    entries = s.entries.map((x) => (x.id === e.id ? { ...x, off: null, ot: null } : x));
    if (e.on !== t) body = `Resumed today's entry (started ${fmtTime(e.on)}).`;
  }
  return { state: { ...s, entries }, title: `Clocked ON at ${fmtTime(t)}`, body };
}
