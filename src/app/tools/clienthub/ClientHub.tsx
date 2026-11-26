"use client";

// Client Hub - the web version of the VirtuallyAnything Timesheet desktop app.
// Data is kept in Cloudflare D1 via /tools/clienthub/api/data (see functions/), mirrored in localStorage.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  addDays,
  annotate,
  clientCss,
  clientFor,
  clockStatus,
  dayWorked,
  emptyState,
  ensureHues,
  Entry,
  Expense,
  fix2,
  fmtDate,
  fmtDateShort,
  fmtHours,
  fmtMoney,
  fmtShort,
  fmtTime,
  isWeekend,
  knownClients,
  lieuText,
  normalizeState,
  parseMoney,
  parseNumber,
  parseTime,
  Period,
  periodStats,
  resolveDate,
  Row,
  sortExpenses,
  sortPeriods,
  State,
  summaryFigures,
  todayIso,
  toggleClock,
  uid,
  weekdays,
} from "./_lib/model";
import { buildWorkbook } from "./_lib/xlsx";
import { importFiles } from "./_lib/import";
import { buildCsv } from "./_lib/csv";

/** True when signed in as a read-only client viewer: every cell is plain text and nothing can be changed. */
const ReadOnly = createContext(false);

const API = "/tools/clienthub/api/data";
const LS_DATA = "clienthub:data:v1";
const LS_TAB = "clienthub:tab";

type Update = (fn: (s: State) => State) => void;
type Sync = "loading" | "saved" | "saving" | "error" | "local";
type Tab = "time" | "bill" | "exp";

const C = {
  weekend: "#d6e8fa",
  open: "#fff9d6",
  paid: "#def3e2",
  ot: "#2996f0",
  boundary: "#696969",
};

const dateHint = () => {
  const t = todayIso();
  return `Enter a date like ${fmtDate(t)} or ${fmtDateShort(t)}.`;
};

function focusCell(key: string) {
  setTimeout(() => {
    const el = document.querySelector<HTMLInputElement>(`[data-cell="${key}"]`);
    if (el) {
      el.focus();
      el.scrollIntoView({ block: "nearest" });
    }
  }, 30);
}

function readLocal(): { rev: number; dirty: boolean; data: State } | null {
  try {
    const raw = localStorage.getItem(LS_DATA);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return { rev: Number(v.rev) || 0, dirty: !!v.dirty, data: normalizeState(v.data) };
  } catch {
    return null;
  }
}

const hasContent = (s: State) => s.entries.length + s.periods.length + s.expenses.length > 0;

// ---------------------------------------------------------------- editable cell

type CellProps = {
  value: string;
  onCommit: (v: string) => string | null | void; // returns an error message to reject the value
  cellKey?: string;
  className?: string;
  placeholder?: string;
  list?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  label: string;
  style?: React.CSSProperties;
};

function EditCell({ value, onCommit, cellKey, className = "", placeholder, list, inputMode, label, style }: CellProps) {
  const readOnly = useContext(ReadOnly);
  const [draft, setDraft] = useState(value);
  const [bad, setBad] = useState(false);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setDraft(value);
      setBad(false);
    }
  }, [value]);

  if (readOnly) {
    return (
      <div className={`min-h-[32px] px-2 py-1.5 ${className}`} style={style}>
        {value}
      </div>
    );
  }

  const commit = () => {
    const v = draft.trim();
    if (v === value.trim()) {
      setDraft(value);
      setBad(false);
      return;
    }
    const err = onCommit(v);
    if (err) {
      toast.error(err, { id: "cell-error" });
      setBad(true);
      return;
    }
    setBad(false);
    setDraft(value);
  };

  return (
    <input
      data-cell={cellKey}
      aria-label={label}
      title={bad ? "Not saved - fix or press Esc" : undefined}
      value={draft}
      list={list}
      inputMode={inputMode}
      placeholder={placeholder}
      autoComplete="off"
      spellCheck={false}
      style={style}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => {
        focused.current = true;
        e.currentTarget.select();
      }}
      onBlur={() => {
        focused.current = false;
        commit();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        else if (e.key === "Escape") {
          setDraft(value);
          setBad(false);
          focused.current = false;
          e.currentTarget.blur();
        }
      }}
      className={`w-full min-w-0 bg-transparent px-2 py-1.5 rounded-[3px] outline-none placeholder:text-black/25 focus:bg-white focus:ring-2 focus:ring-[#2996f0] ${
        bad ? "ring-2 ring-[#d92d20] bg-white" : ""
      } ${className}`}
    />
  );
}

function Btn({
  children,
  onClick,
  kind = "plain",
  title,
  disabled,
  edits = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  kind?: "plain" | "primary";
  title?: string;
  disabled?: boolean;
  edits?: boolean; // changes data, so hidden in read-only mode
}) {
  const readOnly = useContext(ReadOnly);
  if (edits && readOnly) return null;
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors disabled:opacity-50 ${
        kind === "primary"
          ? "bg-[#1f2937] text-white hover:bg-black"
          : "border border-black/15 bg-white text-[#1f2937] hover:bg-black/[0.04]"
      }`}
    >
      {children}
    </button>
  );
}

function DelButton({ onClick, label, visible }: { onClick: () => void; label: string; visible: boolean }) {
  if (useContext(ReadOnly)) return null;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`mx-auto grid h-7 w-7 place-items-center rounded border border-[#b22222]/60 text-[#b22222] hover:bg-[#b22222]/10 focus-visible:opacity-100 ${
        visible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

const th = "px-2 py-2 text-left text-[12px] font-semibold uppercase tracking-wide text-black/55 whitespace-nowrap";
const td = "p-0 align-middle border-b border-black/[0.07]";
const ro = "px-2 py-1.5 whitespace-nowrap tabular-nums";
const mono = { fontFamily: 'ui-monospace, "Cascadia Mono", Consolas, monospace' };

// ---------------------------------------------------------------- summary

function SummaryBlock({ rows, s }: { rows: Row[]; s: State }) {
  const f = summaryFigures(rows, s);
  const h = (v: number) => `${fix2(v)} h`;
  const line = (label: string, hours: number, lieu: number, exp: number | null, strong = false) => (
    <tr className={strong ? "font-semibold" : "text-black/70"}>
      <td className="py-1 pr-6">{label}</td>
      <td className="py-1 pr-6 tabular-nums">{h(hours)}</td>
      <td className="py-1 pr-6 tabular-nums">{lieuText(lieu, s.fullDayHours)}</td>
      <td className="py-1 tabular-nums">{exp == null ? "" : fmtMoney(exp)}</td>
    </tr>
  );
  return (
    <div className="overflow-x-auto">
      <table className="text-[14px]">
        <thead>
          <tr className="text-[12px] uppercase tracking-wide text-black/45">
            <th className="pr-6 text-left font-medium" />
            <th className="pr-6 text-left font-medium">Hours</th>
            <th className="pr-6 text-left font-medium">Time in lieu</th>
            <th className="text-left font-medium">Expenses</th>
          </tr>
        </thead>
        <tbody>
          {line("Outstanding", f.totalH - f.claimedH, f.totalO - f.claimedO, f.outX, true)}
          {line("Total", f.totalH, f.totalO, null)}
          {line("Claimed", f.claimedH, f.claimedO, f.claimedX)}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------- timesheet tab

function TimesheetTab({ s, rows, update }: { s: State; rows: Row[]; update: Update }) {
  const isRO = useContext(ReadOnly);
  const [selected, setSelected] = useState<string | null>(null);
  const periods = useMemo(() => sortPeriods(s.periods), [s.periods]);

  const patch = (id: string, p: Partial<Entry>) =>
    update((st) => ({ ...st, entries: st.entries.map((e) => (e.id === id ? { ...e, ...p } : e)) }));

  const addEntry = (date: string) => {
    const id = uid();
    update((st) => ({
      ...st,
      entries: [...st.entries, { id, date, on: null, off: null, note: "", client: "", ot: null }],
    }));
    setSelected(id);
    focusCell(`${id}:on`);
  };

  const insertAfter = () => {
    const sel = rows.find((r) => r.id === selected);
    const basis = sel ? sel.date : rows.length ? rows[rows.length - 1].date : addDays(todayIso(), -1);
    addEntry(addDays(basis, 1));
  };

  const del = (r: Row) => {
    if (!confirm(`Are you sure you want to delete ${fmtDate(r.date)}?\n\nThis removes that day's clock on/off times and note.`))
      return;
    update((st) => ({ ...st, entries: st.entries.filter((e) => e.id !== r.id) }));
  };

  const commit = (r: Row, col: "client" | "date" | "on" | "off" | "hours" | "ot" | "note", v: string): string | null => {
    switch (col) {
      case "client": {
        // A client typed here overrides it for this day; typing what the billing period already says,
        // or clearing the cell, goes back to the period's client.
        const fromPeriod = clientFor(r.date, s.periods);
        patch(r.id, { client: !v || v.toLowerCase() === fromPeriod.toLowerCase() ? "" : v });
        return null;
      }
      case "date": {
        const d = resolveDate(v, r.date);
        if (!d) return dateHint();
        patch(r.id, { date: d, ot: null }); // changed the date: overtime goes back to the automatic rule
        return null;
      }
      case "on":
      case "off": {
        let t: number | null = null;
        if (v) {
          t = parseTime(v);
          if (t == null) return "Enter a time like 8:30 AM or 5:05 PM, or leave it blank.";
        }
        const on = col === "on" ? t : r.on;
        const off = col === "off" ? t : r.off;
        if (on != null && off != null && off < on) return "Clock Off can't be before Clock On.";
        patch(r.id, { [col]: t, ot: null });
        return null;
      }
      case "hours": {
        // Hours is the regular time, so total worked = Hours + Overtime. Overtime stays as shown.
        if (!v) return null;
        const h = parseNumber(v);
        if (h == null || h < 0) return "Enter hours as a number, e.g. 8.5.";
        if (r.on == null) return "Set Clock On first; Clock Off is then worked out from Hours + Overtime.";
        const otShown = r.overtime ?? 0;
        if (r.on / 60 + h + otShown >= 24) return "That would run past midnight.";
        patch(r.id, { off: r.on + Math.floor((h + otShown) * 60 + 1e-6), ot: r.overtime != null ? otShown : null });
        return null;
      }
      case "ot": {
        // Typed overtime comes out of the time worked (Clock On/Off stay put); Hours becomes the rest.
        if (!v) {
          patch(r.id, { ot: null });
          return null;
        }
        const ov = parseNumber(v);
        if (ov == null || ov < 0) return "Enter overtime as a number of hours, e.g. 1.5.";
        const w = dayWorked(rows, r.date);
        if (w <= 0)
          return "Set Clock On and Clock Off first. Overtime is taken out of the time worked, so Hours + Overtime always equals it.";
        if (ov > w + 0.005) return `Overtime can't be more than the time worked that day (${fix2(w)} h).`;
        patch(r.id, { ot: ov });
        return null;
      }
      case "note":
        patch(r.id, { note: v });
        return null;
    }
  };

  // Client column: the name once at the start of each run of days for the same client (and again at the start of
  // each billing period), with every cell in the run shaded in that client's colour and a heavier line between runs.
  let prev = "";
  let prevPeriod = -2;
  const view = rows.map((r, i) => {
    const c = r.client || clientFor(r.date, periods);
    const period = periods.findIndex((p) => r.date >= p.from && r.date <= p.to);
    const continuing = !!c && c === prev && period === prevPeriod;
    const boundary = i > 0 && (period !== prevPeriod || c !== prev);
    prev = c;
    prevPeriod = period;
    return { r, c, continuing, boundary };
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {!isRO && (
          <label className="flex items-center gap-2 text-[14px] font-semibold">
            Standard hours per day (including lunch):
            <span className="w-20 rounded-md border border-black/15 bg-white">
              <EditCell
                label="Standard hours per day"
                inputMode="decimal"
                value={fmtShort(s.fullDayHours)}
                onCommit={(v) => {
                  const n = parseNumber(v);
                  if (n == null || n < 0.25 || n > 24) return "Enter the standard day in hours, between 0.25 and 24.";
                  update((st) => ({ ...st, fullDayHours: n }));
                }}
              />
            </span>
          </label>
        )}
        <span className="text-[13px] text-black/50">
          Assumption is hours over {fmtShort(s.fullDayHours)} in a day are overtime, and all weekend hours are overtime.
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[860px] border-collapse text-[14px]">
          <thead className="bg-[#f7f8fa]">
            <tr className="border-b border-black/10">
              <th className="w-5" />
              <th className={`${th} w-[140px]`}>Client</th>
              <th className={`${th} w-[130px]`}>Date</th>
              <th className={`${th} w-[100px]`}>Clock On</th>
              <th className={`${th} w-[100px]`}>Clock Off</th>
              <th className={`${th} w-[80px]`}>Hours</th>
              <th className={`${th} w-[85px]`}>Overtime</th>
              <th className={th}>Note</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {view.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-black/45">
                  {isRO ? (
                    "No days yet."
                  ) : (
                    <>
                      No days yet. Use <b>Clock On</b> at the top, or <b>Add day</b> below.
                    </>
                  )}
                </td>
              </tr>
            )}
            {view.map(({ r, c, continuing, boundary }) => {
              const open = r.on != null && r.off == null;
              const bg = open ? C.open : isWeekend(r.date) ? C.weekend : undefined;
              const sel = selected === r.id;
              const line = boundary ? { borderTop: `2px solid ${C.boundary}` } : undefined;
              const hasOt = (r.overtime ?? 0) > 0;
              return (
                <tr
                  key={r.id}
                  className="group"
                  style={{ background: bg }}
                  onFocusCapture={() => setSelected(r.id)}
                  onClick={() => setSelected(r.id)}
                >
                  <td className={`${td} text-center text-[10px] text-[#2996f0]`} style={line}>
                    {sel ? "▶" : ""}
                  </td>
                  <td className={td} style={{ ...line, background: c ? clientCss(c, s.clientHues) : undefined }}>
                    <EditCell
                      label="Client"
                      list="ch-clients"
                      cellKey={`${r.id}:client`}
                      value={continuing ? "" : c}
                      onCommit={(v) => commit(r, "client", v)}
                    />
                  </td>
                  <td className={td} style={line}>
                    <EditCell label="Date" style={mono} cellKey={`${r.id}:date`} value={fmtDate(r.date)} onCommit={(v) => commit(r, "date", v)} />
                  </td>
                  <td className={td} style={line}>
                    <EditCell
                      label="Clock On"
                      cellKey={`${r.id}:on`}
                      placeholder="—"
                      value={r.on != null ? fmtTime(r.on) : ""}
                      onCommit={(v) => commit(r, "on", v)}
                    />
                  </td>
                  <td className={td} style={line}>
                    <EditCell
                      label="Clock Off"
                      cellKey={`${r.id}:off`}
                      placeholder={open ? "on now" : "—"}
                      value={r.off != null ? fmtTime(r.off) : ""}
                      onCommit={(v) => commit(r, "off", v)}
                    />
                  </td>
                  <td className={td} style={line}>
                    <EditCell
                      label="Hours"
                      inputMode="decimal"
                      className="tabular-nums"
                      value={fmtHours(r.hours)}
                      onCommit={(v) => commit(r, "hours", v)}
                    />
                  </td>
                  <td className={td} style={line}>
                    <EditCell
                      label="Overtime"
                      inputMode="decimal"
                      className={`tabular-nums ${hasOt ? "font-bold" : ""}`}
                      style={hasOt ? { color: C.ot } : undefined}
                      value={fmtHours(r.overtime)}
                      onCommit={(v) => commit(r, "ot", v)}
                    />
                  </td>
                  <td className={td} style={line}>
                    <EditCell label="Note" value={r.note} onCommit={(v) => commit(r, "note", v)} />
                  </td>
                  <td className={td} style={line}>
                    <DelButton label={`Delete ${fmtDate(r.date)}`} visible={sel} onClick={() => del(r)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Btn edits onClick={() => addEntry(todayIso())}>Add day</Btn>
        <Btn edits onClick={insertAfter}>Insert day after selected</Btn>
      </div>
      <SummaryBlock rows={rows} s={s} />
    </div>
  );
}

// ---------------------------------------------------------------- billing tab

function BillingTab({ s, rows, update }: { s: State; rows: Row[]; update: Update }) {
  const isRO = useContext(ReadOnly);
  const [selected, setSelected] = useState<string | null>(null);
  const periods = useMemo(() => sortPeriods(s.periods), [s.periods]);

  const patch = (id: string, p: Partial<Period>) =>
    update((st) => ({ ...st, periods: st.periods.map((x) => (x.id === id ? { ...x, ...p } : x)) }));

  const add = () => {
    let from: string;
    if (s.periods.length) from = addDays(s.periods.reduce((m, p) => (p.to > m ? p.to : m), s.periods[0].to), 1);
    else {
      const t = todayIso();
      const dow = new Date(t + "T00:00:00Z").getUTCDay();
      from = addDays(t, -((dow + 6) % 7)); // this week's Monday
    }
    const to = addDays(from, 13);
    const last = [...s.periods].sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0)).pop();
    const id = uid();
    update((st) => ({
      ...st,
      periods: [
        ...st.periods,
        { id, from, to, hours: weekdays(from, to) * st.fullDayHours, paid: false, client: last ? last.client : "" },
      ],
    }));
    setSelected(id);
    focusCell(`${id}:from`);
  };

  const del = (p: Period) => {
    if (!confirm(`Are you sure you want to delete ${fmtDate(p.from)} to ${fmtDate(p.to)}?\n\nYour timesheet days are not affected.`))
      return;
    update((st) => ({ ...st, periods: st.periods.filter((x) => x.id !== p.id) }));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Btn edits onClick={add}>Add billing period</Btn>
      </div>
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[860px] border-collapse text-[14px]">
          <thead className="bg-[#f7f8fa]">
            <tr className="border-b border-black/10">
              <th className="w-5" />
              <th className={`${th} w-[150px]`}>Client</th>
              <th className={`${th} w-[130px]`}>From</th>
              <th className={`${th} w-[130px]`}>To</th>
              <th className={`${th} w-[100px]`}>Hours to bill</th>
              <th className={`${th} w-[50px] text-center`}>Paid</th>
              <th className={th}>Regular</th>
              <th className={th}>Overtime</th>
              <th className={th}>Worked</th>
              <th className={th}>Expenses</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-black/45">
                  No billing periods yet.
                </td>
              </tr>
            )}
            {periods.map((p) => {
              const x = periodStats(p, rows, s.expenses);
              const sel = selected === p.id;
              return (
                <tr
                  key={p.id}
                  className="group"
                  style={{ background: p.paid ? C.paid : undefined }}
                  onFocusCapture={() => setSelected(p.id)}
                  onClick={() => setSelected(p.id)}
                >
                  <td className={`${td} text-center text-[10px] text-[#2996f0]`}>{sel ? "▶" : ""}</td>
                  <td className={td} style={{ background: p.client ? clientCss(p.client, s.clientHues) : undefined }}>
                    <EditCell
                      label="Client"
                      list="ch-clients"
                      placeholder="—"
                      value={p.client}
                      onCommit={(v) => {
                        patch(p.id, { client: v });
                      }}
                    />
                  </td>
                  <td className={td}>
                    <EditCell
                      label="From"
                      style={mono}
                      cellKey={`${p.id}:from`}
                      value={fmtDate(p.from)}
                      onCommit={(v) => {
                        const d = resolveDate(v, p.from);
                        if (!d) return dateHint();
                        if (d > p.to) return "'From' can't be after 'To'.";
                        patch(p.id, { from: d });
                      }}
                    />
                  </td>
                  <td className={td}>
                    <EditCell
                      label="To"
                      style={mono}
                      value={fmtDate(p.to)}
                      onCommit={(v) => {
                        const d = resolveDate(v, p.to);
                        if (!d) return dateHint();
                        if (d < p.from) return "'To' can't be before 'From'.";
                        patch(p.id, { to: d });
                      }}
                    />
                  </td>
                  <td className={td}>
                    <EditCell
                      label="Hours to bill"
                      inputMode="decimal"
                      className="tabular-nums"
                      value={fix2(p.hours)}
                      onCommit={(v) => {
                        const h = parseNumber(v);
                        if (h == null || h < 0) return "Enter the hours to bill as a number, e.g. 76.";
                        patch(p.id, { hours: h });
                      }}
                    />
                  </td>
                  <td className={`${td} text-center`}>
                    <input
                      type="checkbox"
                      aria-label="Paid"
                      className="h-4 w-4 accent-[#1f8a4c] disabled:opacity-100"
                      disabled={isRO}
                      checked={p.paid}
                      onChange={(e) => patch(p.id, { paid: e.target.checked })}
                    />
                  </td>
                  <td className={td}>
                    <div className={ro}>{fix2(x.reg)}</div>
                  </td>
                  <td className={td}>
                    <div className={`${ro} font-bold`} style={{ color: C.ot }}>
                      {fix2(x.ot)}
                    </div>
                  </td>
                  <td className={td}>
                    <div className={ro}>{fix2(x.worked)}</div>
                  </td>
                  <td className={td}>
                    <div className={ro}>{fmtMoney(x.expenses)}</div>
                  </td>
                  <td className={td}>
                    <DelButton label="Delete billing period" visible={sel} onClick={() => del(p)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <SummaryBlock rows={rows} s={s} />
    </div>
  );
}

// ---------------------------------------------------------------- expenses tab

function ExpensesTab({ s, update }: { s: State; update: Update }) {
  const isRO = useContext(ReadOnly);
  const [selected, setSelected] = useState<string | null>(null);
  const list = useMemo(() => sortExpenses(s.expenses), [s.expenses]);

  const patch = (id: string, p: Partial<Expense>) =>
    update((st) => ({ ...st, expenses: st.expenses.map((x) => (x.id === id ? { ...x, ...p } : x)) }));

  const add = () => {
    const id = uid();
    update((st) => ({
      ...st,
      expenses: [
        ...st.expenses,
        // tagged for today's billing-period client to start with
        { id, date: todayIso(), item: "", company: "", use: "", price: 0, paid: false, client: clientFor(todayIso(), st.periods) },
      ],
    }));
    setSelected(id);
    focusCell(`${id}:item`);
  };

  const del = (x: Expense) => {
    if (!confirm(`Are you sure you want to delete "${x.item || "this expense"}"?`)) return;
    update((st) => ({ ...st, expenses: st.expenses.filter((e) => e.id !== x.id) }));
  };

  const open = s.expenses.filter((x) => !x.paid).reduce((a, x) => a + x.price, 0);
  const paid = s.expenses.filter((x) => x.paid).reduce((a, x) => a + x.price, 0);

  const text = (x: Expense, k: "item" | "company" | "use", label: string) => (
    <td className={td}>
      <EditCell label={label} cellKey={`${x.id}:${k}`} value={x[k]} onCommit={(v) => patch(x.id, { [k]: v })} />
    </td>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Btn edits onClick={add}>Add expense</Btn>
      </div>
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[960px] border-collapse text-[14px]">
          <thead className="bg-[#f7f8fa]">
            <tr className="border-b border-black/10">
              <th className="w-5" />
              <th className={`${th} w-[130px]`}>Date</th>
              <th className={`${th} w-[140px]`}>Client</th>
              <th className={th}>Item</th>
              <th className={`${th} w-[170px]`}>Company</th>
              <th className={th}>Use</th>
              <th className={`${th} w-[100px] text-right`}>Price</th>
              <th className={`${th} w-[50px] text-center`}>Paid</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-black/45">
                  No expenses yet.
                </td>
              </tr>
            )}
            {list.map((x) => {
              const sel = selected === x.id;
              return (
                <tr
                  key={x.id}
                  className="group"
                  style={{ background: x.paid ? C.paid : undefined }}
                  onFocusCapture={() => setSelected(x.id)}
                  onClick={() => setSelected(x.id)}
                >
                  <td className={`${td} text-center text-[10px] text-[#2996f0]`}>{sel ? "▶" : ""}</td>
                  <td className={td}>
                    <EditCell
                      label="Date"
                      style={mono}
                      value={fmtDate(x.date)}
                      onCommit={(v) => {
                        const d = resolveDate(v, x.date);
                        if (!d) return dateHint();
                        patch(x.id, { date: d });
                      }}
                    />
                  </td>
                  <td className={td} style={{ background: x.client ? clientCss(x.client, s.clientHues) : undefined }}>
                    <EditCell
                      label="Client"
                      list="ch-clients"
                      placeholder={isRO ? "" : "—"}
                      value={x.client}
                      onCommit={(v) => {
                        patch(x.id, { client: v });
                      }}
                    />
                  </td>
                  {text(x, "item", "Item")}
                  {text(x, "company", "Company")}
                  {text(x, "use", "Use")}
                  <td className={td}>
                    <EditCell
                      label="Price"
                      inputMode="decimal"
                      className="text-right tabular-nums"
                      value={fmtMoney(x.price)}
                      onCommit={(v) => {
                        const p = parseMoney(v);
                        if (p == null || p < 0) return "Enter a price like 12.50.";
                        patch(x.id, { price: p });
                      }}
                    />
                  </td>
                  <td className={`${td} text-center`}>
                    <input
                      type="checkbox"
                      aria-label="Paid"
                      className="h-4 w-4 accent-[#1f8a4c] disabled:opacity-100"
                      disabled={isRO}
                      checked={x.paid}
                      onChange={(e) => patch(x.id, { paid: e.target.checked })}
                    />
                  </td>
                  <td className={td}>
                    <DelButton label="Delete expense" visible={sel} onClick={() => del(x)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-1 text-[14px] font-semibold">
        <span>Outstanding: {fmtMoney(open)}</span>
        <span className="text-black/70">Paid: {fmtMoney(paid)}</span>
        <span className="text-black/70">Total: {fmtMoney(open + paid)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- app

export default function ClientHub() {
  const [state, setState] = useState<State | null>(null);
  const [sync, setSync] = useState<Sync>("loading");
  const [tab, setTab] = useState<Tab>("time");
  const [now, setNow] = useState<Date | null>(null);
  const stateRef = useRef<State | null>(null);
  const revRef = useRef(0);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const cloudRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewer, setViewer] = useState<string | null>(null); // read-only client name, e.g. "Lucky Robots"
  const viewerRef = useRef<string | null>(null);

  const persistLocal = useCallback(() => {
    if (viewerRef.current) return; // never keep a client's view in this browser's owner cache
    try {
      localStorage.setItem(
        LS_DATA,
        JSON.stringify({ rev: revRef.current, dirty: dirtyRef.current, data: stateRef.current })
      );
    } catch {}
  }, []);

  const apply = useCallback((s: State) => {
    const v = ensureHues(s);
    stateRef.current = v;
    setState(v);
  }, []);

  const flush = useCallback(async () => {
    if (!cloudRef.current || savingRef.current || !dirtyRef.current || !stateRef.current) return;
    savingRef.current = true;
    dirtyRef.current = false;
    let failed = false;
    setSync("saving");
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rev: revRef.current, data: stateRef.current }),
      });
      if (res.status === 401) {
        dirtyRef.current = true;
        persistLocal();
        location.reload();
        return;
      }
      if (res.status === 409) {
        const cur = await res.json();
        revRef.current = cur.rev;
        dirtyRef.current = false;
        apply(normalizeState(cur.data));
        toast(
          "The timesheet was changed on another device, so it has been reloaded here. Your last change wasn't saved, so please make it again.",
          { duration: 8000, icon: "↻" }
        );
      } else if (!res.ok) throw new Error(String(res.status));
      else revRef.current = (await res.json()).rev;
      setSync(dirtyRef.current ? "saving" : "saved");
    } catch {
      failed = true;
      dirtyRef.current = true;
      setSync("error");
    } finally {
      savingRef.current = false;
      persistLocal();
      if (dirtyRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(flush, failed ? 5000 : 700);
      }
    }
  }, [apply, persistLocal]);

  const update: Update = useCallback(
    (fn) => {
      const cur = stateRef.current;
      if (!cur || viewerRef.current) return;
      const next = ensureHues(fn(cur));
      if (next === cur) return;
      stateRef.current = next;
      setState(next);
      dirtyRef.current = true;
      persistLocal();
      if (cloudRef.current) {
        setSync("saving");
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(flush, 700);
      }
    },
    [flush, persistLocal]
  );

  // initial load
  useEffect(() => {
    setNow(new Date());
    try {
      const t = localStorage.getItem(LS_TAB);
      if (t === "time" || t === "bill" || t === "exp") setTab(t);
    } catch {}
    (async () => {
      const local = readLocal();
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (res.status === 401) return location.reload();
        const body = await res.json().catch(() => null);
        if (body?.role === "viewer") {
          viewerRef.current = body.viewer || "client";
          setViewer(viewerRef.current);
          cloudRef.current = true;
          revRef.current = body.rev ?? 0;
          apply(res.ok && body.data ? normalizeState(body.data) : emptyState());
          setSync("saved");
          return;
        }
        if (!res.ok || !body) throw new Error(String(res.status));
        cloudRef.current = true;
        if (local && local.dirty && local.rev === body.rev && hasContent(local.data)) {
          // unsaved changes from last time, made on top of the current cloud copy
          revRef.current = body.rev;
          apply(local.data);
          dirtyRef.current = true;
          flush();
        } else if (body.data) {
          revRef.current = body.rev;
          apply(normalizeState(body.data));
          setSync("saved");
        } else {
          revRef.current = 0;
          apply(local ? local.data : emptyState());
          if (local && hasContent(local.data)) {
            dirtyRef.current = true;
            flush();
          } else setSync("saved");
        }
      } catch {
        // storage not set up yet (or running under `next dev`): keep everything in this browser
        cloudRef.current = false;
        apply(local ? local.data : emptyState());
        setSync("local");
      }
      persistLocal();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clock display
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // pick up changes made on another device when coming back to this tab
  useEffect(() => {
    const refresh = async () => {
      setNow(new Date());
      if (document.visibilityState !== "visible" || !cloudRef.current || dirtyRef.current || savingRef.current) return;
      if (document.activeElement instanceof HTMLInputElement) return;
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (!res.ok) return;
        const body = await res.json();
        if (body.rev !== revRef.current && !dirtyRef.current && !savingRef.current && body.data) {
          revRef.current = body.rev;
          apply(normalizeState(body.data));
          persistLocal();
        }
      } catch {}
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (cloudRef.current && (dirtyRef.current || savingRef.current)) e.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [apply, persistLocal]);

  const rows = useMemo(() => (state ? annotate(state.entries, state.fullDayHours) : []), [state]);
  const clients = useMemo(() => (state ? knownClients(state) : []), [state]);

  if (!state || !now) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f5f7] text-[14px] text-black/50" style={rootFont}>
        Loading timesheet…
      </div>
    );
  }

  const clock = clockStatus(state, now);
  const stale = rows.find((e) => e.date < todayIso(now) && e.on != null && e.off == null);

  const doClock = () => {
    const res = toggleClock(stateRef.current as State, new Date());
    update(() => res.state);
    setNow(new Date());
    toast.success(
      <span>
        <b>{res.title}</b>
        <br />
        {res.body}
      </span>
    );
  };

  const download = (data: BlobPart, type: string, name: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };
  const filePrefix = viewer ? `${viewer} - VirtuallyAnything` : "VirtuallyAnything";
  const tabNames: Record<Tab, string> = { time: "Timesheet", bill: "Billing periods", exp: "Expenses" };

  const doExport = () =>
    download(
      buildWorkbook(state) as BlobPart,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      `${filePrefix} Timesheet ${todayIso()}.xlsx`
    );

  const doCsv = () =>
    download(buildCsv(tab, state), "text/csv;charset=utf-8", `${filePrefix} ${tabNames[tab]} ${todayIso()}.csv`);

  const doImport = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const imp = await importFiles([...files], state.fullDayHours);
    const parts = [
      imp.entries && `${imp.entries.length} timesheet days`,
      imp.periods && `${imp.periods.length} billing periods`,
      imp.expenses && `${imp.expenses.length} expenses`,
      imp.clientHues && "client colours",
      imp.fullDayHours && `standard day of ${fmtShort(imp.fullDayHours)} h`,
    ].filter(Boolean) as string[];
    if (fileRef.current) fileRef.current.value = "";
    if (parts.length === 0) {
      toast.error("Those files don't look like the desktop app's records (timesheet.csv, billing.csv, expenses.csv).");
      return;
    }
    if (!confirm(`Import ${parts.join(", ")}?\n\nThis replaces the matching data here.`)) return;
    update((s) => ({
      ...s,
      entries: imp.entries ?? s.entries,
      periods: imp.periods ?? s.periods,
      expenses: imp.expenses ?? s.expenses,
      clientHues: { ...s.clientHues, ...(imp.clientHues ?? {}) },
      fullDayHours: imp.fullDayHours ?? s.fullDayHours,
    }));
    toast.success(`Imported ${parts.join(", ")}.`);
  };

  const chooseTab = (t: Tab) => {
    setTab(t);
    try {
      localStorage.setItem(LS_TAB, t);
    } catch {}
  };

  const syncText: Record<Sync, string> = {
    loading: "Loading…",
    saved: "Saved",
    saving: "Saving…",
    error: "Not saved - retrying",
    local: "This browser only",
  };
  const syncColor: Record<Sync, string> = {
    loading: "#9ca3af",
    saved: "#1f8a4c",
    saving: "#d97706",
    error: "#b42318",
    local: "#d97706",
  };

  return (
    <ReadOnly.Provider value={!!viewer}>
    {/* w-screen lays the page out across the full window, so the vertical scrollbar floats over the right padding
        and nothing shifts when it appears or disappears (e.g. switching between a long and a short tab).
        overflow-x-clip stops the part under the scrollbar from making the page scroll sideways. */}
    <div className="overflow-x-clip">
    <div className="min-h-screen w-screen bg-[#f4f5f7] text-[#16181d]" style={rootFont}>
      {viewer && (
        <div className="bg-[#1f2937] px-4 py-2 text-center text-[13px] font-medium text-white">
          Viewing in read-only mode as {viewer}
        </div>
      )}
      <datalist id="ch-clients">
        {clients.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tools/hub-logo.png" alt="" width={64} height={64} className="h-16 w-16 shrink-0" style={{ imageRendering: "pixelated" }} />
          <div className="mr-auto min-w-0">
            <h1 className="text-[17px] font-semibold leading-tight">
              VirtuallyAnything Timesheet{viewer ? ` · ${viewer}` : ""}
            </h1>
            {!viewer && (
              <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-black/55">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: syncColor[sync] }} />
                {syncText[sync]}
              </div>
            )}
          </div>

          {!viewer && (
          <div className="flex items-center gap-3">
            <div className="text-right text-[13px] leading-tight">
              <div className="font-semibold" style={{ color: clock.on ? "#1f8a4c" : "#b42318" }}>
                {clock.on ? "ON" : "OFF"}
              </div>
              <div className="text-black/55 tabular-nums">
                {clock.on
                  ? `since ${fmtTime(clock.since as number)} · ${fix2(clock.live)} h`
                  : clock.todayWorked > 0
                  ? `today ${fix2(clock.todayWorked)} h, OT ${fix2(clock.todayOt)}`
                  : "not clocked on today"}
              </div>
            </div>
            <button
              type="button"
              onClick={doClock}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors"
              style={{ background: clock.on ? "#c83737" : "#28a745" }}
            >
              <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="3" />
                <path d="M16 16V8M16 16l5 4" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {clock.on ? "Clock Off" : "Clock On"}
            </button>
          </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Btn onClick={doExport} title="Download every sheet as an Excel workbook">
              Export to Excel
            </Btn>
            <Btn onClick={doCsv} title={`Download the ${tabNames[tab]} tab as a CSV file`}>
              {/* every tab's label is stacked in one spot, so the button is always as wide as the longest */}
              <span className="grid text-center">
                {Object.entries(tabNames).map(([k, name]) => (
                  <span key={k} className={`col-start-1 row-start-1 ${k === tab ? "" : "invisible"}`}>
                    Export {name} CSV
                  </span>
                ))}
              </span>
            </Btn>
            <Btn
              edits
              onClick={() => fileRef.current?.click()}
              title="Import timesheet.csv, billing.csv, expenses.csv, client-colors.csv and settings.ini from the desktop app's records folder"
            >
              Import from desktop…
            </Btn>
            <a
              href="/tools/clienthub/logout"
              className="inline-flex items-center rounded-md px-3 py-1.5 text-[13px] font-medium text-black/60 hover:bg-black/[0.04]"
            >
              Sign out
            </a>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".csv,.ini,text/csv"
              className="hidden"
              onChange={(e) => doImport(e.target.files)}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] space-y-2 px-4 pt-4">
        {sync === "local" && (
          <div className="rounded-lg border border-[#f5c46b] bg-[#fff7e6] px-4 py-2.5 text-[13px]">
            Cloud storage isn't connected, so changes are only saved in this browser.
          </div>
        )}
        {stale && !viewer && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#f5c46b] bg-[#fff7e6] px-4 py-2.5 text-[13px]">
            <span>
              <b>Missing clock-off:</b> nothing recorded on {fmtDate(stale.date)}.
            </span>
            <button
              type="button"
              className="font-semibold text-[#2563eb] hover:underline"
              onClick={() => {
                chooseTab("time");
                focusCell(`${stale.id}:off`);
              }}
            >
              Fix it
            </button>
          </div>
        )}
      </div>

      <nav className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 pt-3" role="tablist">
        {(
          [
            ["time", "Timesheet"],
            ["bill", "Billing period"],
            ["exp", "Expenses"],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => chooseTab(k)}
            className={`whitespace-nowrap rounded-t-md border-b-2 px-4 py-2 text-[14px] font-medium ${
              tab === k ? "border-[#16181d] text-[#16181d]" : "border-transparent text-black/50 hover:text-black/80"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-4">
        {tab === "time" && <TimesheetTab s={state} rows={rows} update={update} />}
        {tab === "bill" && <BillingTab s={state} rows={rows} update={update} />}
        {tab === "exp" && <ExpensesTab s={state} update={update} />}
      </main>
    </div>
    </div>
    </ReadOnly.Provider>
  );
}

const rootFont: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};
