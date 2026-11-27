// Reads the desktop app's records folder (Documents\LuckyTime\records): timesheet.csv, billing.csv,
// expenses.csv, client-colors.csv and settings.ini.

import { annotate, Entry, Expense, parseDate, parseMoney, parseNumber, parseTime, Period, uid } from "./model";

export type Imported = {
  entries?: Entry[];
  periods?: Period[];
  expenses?: Expense[];
  clientHues?: Record<string, number>;
  fullDayHours?: number;
  files: string[];
};

function splitCsv(line: string): string[] {
  const res: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      res.push(cur);
      cur = "";
    } else cur += ch;
  }
  res.push(cur);
  return res;
}

function dataLines(text: string): string[][] {
  return text
    .replace(/^﻿/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trimStart().startsWith("#"))
    .map(splitCsv);
}

const yes = (s: string | undefined) => /^(yes|true|paid)$/i.test((s || "").trim());

function parseTimesheet(text: string, fullDay: number): Entry[] {
  const list: Entry[] = [];
  const fileOt = new Map<string, number>();
  for (const f of dataLines(text)) {
    const date = parseDate(f[0] || "");
    if (!date) continue; // header row or junk
    const e: Entry = {
      id: uid(),
      date,
      on: f.length > 1 ? parseTime(f[1]) : null,
      off: f.length > 2 ? parseTime(f[2]) : null,
      note: f[5] ?? "",
      client: (f[6] ?? "").trim(),
      ot: null,
    };
    const o = f.length > 4 ? parseNumber(f[4]) : null;
    if (o != null) fileOt.set(e.id, o);
    list.push(e);
  }
  // An Overtime figure in the file that differs from the automatic rule is a manual overwrite.
  const auto = new Map(annotate(list, fullDay).map((r) => [r.id, r.overtime ?? 0]));
  for (const e of list) {
    const o = fileOt.get(e.id);
    if (o != null && Math.abs(o - (auto.get(e.id) ?? 0)) > 0.005) e.ot = o;
  }
  return list;
}

function parsePeriods(text: string): Period[] {
  const out: Period[] = [];
  for (const f of dataLines(text)) {
    const from = parseDate(f[0] || "");
    const to = parseDate(f[1] || "");
    if (!from || !to) continue;
    const paid = yes(f[3]);
    // files saved before there was an OT Paid column: Paid covered the overtime too
    const otPaid = f.length > 5 ? yes(f[5]) : paid;
    out.push({ id: uid(), from, to, hours: parseNumber(f[2] ?? "") ?? 0, paid, otPaid, client: (f[4] ?? "").trim() });
  }
  return out;
}

function parseExpenses(text: string): Expense[] {
  const out: Expense[] = [];
  for (const f of dataLines(text)) {
    const date = parseDate(f[0] || "");
    if (!date) continue;
    out.push({
      id: uid(),
      date,
      item: f[1] ?? "",
      company: f[2] ?? "",
      price: parseMoney(f[3] ?? "") ?? 0,
      paid: yes(f[4]),
      use: f[5] ?? "",
      client: (f[6] ?? "").trim(),
    });
  }
  return out;
}

function parseHues(text: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const f of dataLines(text)) {
    const name = (f[0] || "").trim();
    const h = parseNumber(f[1] ?? "");
    if (name && h != null) out[name.toLowerCase()] = ((Math.round(h) % 360) + 360) % 360;
  }
  return out;
}

function parseSettings(text: string): number | undefined {
  const m = /^\s*StandardHours\s*=\s*([\d.]+)\s*$/m.exec(text);
  const n = m ? Number(m[1]) : NaN;
  return n > 0 && n <= 24 ? n : undefined;
}

/** Works out what each file is from its name or its header row. */
export async function importFiles(files: File[], fullDay: number): Promise<Imported> {
  const texts = await Promise.all(files.map(async (f) => ({ name: f.name, text: await f.text() })));
  const res: Imported = { files: [] };
  // settings first, so the overtime rule used to spot typed overtime matches the desktop app's
  for (const { name, text } of texts)
    if (/\.ini$/i.test(name) || /StandardHours\s*=/.test(text)) {
      res.fullDayHours = parseSettings(text);
      res.files.push(name);
    }
  const day = res.fullDayHours ?? fullDay;
  for (const { name, text } of texts) {
    const head = dataLines(text)[0]?.map((x) => x.trim().toLowerCase()) ?? [];
    const n = name.toLowerCase();
    if (/\.ini$/i.test(name) || /StandardHours\s*=/.test(text)) continue;
    if (n.includes("color") || n.includes("colour") || /colour \(hue/i.test(text)) res.clientHues = parseHues(text);
    else if (n.includes("billing") || (head[0] === "from" && head[1] === "to")) res.periods = parsePeriods(text);
    else if (n.includes("expense") || head[1] === "item") res.expenses = parseExpenses(text);
    else if (n.includes("timesheet") || head[1] === "clock on") res.entries = parseTimesheet(text, day);
    else continue;
    res.files.push(name);
  }
  return res;
}
