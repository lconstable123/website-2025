// CSV export of one tab (Timesheet, Billing periods or Expenses). Dates are ISO (yyyy-mm-dd) so Excel and
// other tools read them reliably; a UTF-8 byte order mark is added so Excel shows accents correctly.

import {
  annotate,
  clientFor,
  fix2,
  fmtHours,
  fmtTime,
  periodStats,
  sortExpenses,
  sortPeriods,
  State,
} from "./model";

export type CsvKind = "time" | "bill" | "exp";

function cell(v: string | number | null | undefined): string {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const lines = (rows: (string | number | null | undefined)[][]) =>
  "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";

export function buildCsv(kind: CsvKind, s: State): string {
  const days = annotate(s.entries, s.fullDayHours);
  if (kind === "time") {
    return lines([
      ["Client", "Date", "Clock On", "Clock Off", "Hours", "Overtime", "Note"],
      ...days.map((e) => [
        e.client || clientFor(e.date, s.periods),
        e.date,
        e.on != null ? fmtTime(e.on) : "",
        e.off != null ? fmtTime(e.off) : "",
        fmtHours(e.hours),
        fmtHours(e.overtime),
        e.note,
      ]),
    ]);
  }
  if (kind === "bill") {
    return lines([
      ["Client", "From", "To", "Hours to bill", "Paid", "Regular", "Overtime", "Worked", "Expenses", "Remaining"],
      ...sortPeriods(s.periods).map((p) => {
        const x = periodStats(p, days, s.expenses);
        return [
          p.client,
          p.from,
          p.to,
          fix2(p.hours),
          p.paid ? "Yes" : "No",
          fix2(x.reg),
          fix2(x.ot),
          fix2(x.worked),
          fix2(x.expenses),
          x.remaining == null ? "" : fix2(x.remaining),
        ];
      }),
    ]);
  }
  return lines([
    ["Date", "Client", "Item", "Company", "Use", "Price", "Paid"],
    ...sortExpenses(s.expenses).map((x) => [x.date, x.client, x.item, x.company, x.use, fix2(x.price), x.paid ? "Yes" : "No"]),
  ]);
}
