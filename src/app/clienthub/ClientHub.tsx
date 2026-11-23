"use client";

// Client Hub - the web version of the VirtuallyAnything Timesheet desktop app.
// Data is kept in Cloudflare D1 via /clienthub/api/data (see functions/), mirrored in localStorage.

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
  remainingText,
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

const API = "/clienthub/api/data";
const LS_DATA = "clienthub:data:v1";
const LS_TAB = "clienthub:tab";

type Update = (fn: (s: State) => State) => void;
type Sync = "loading" | "saved" | "saving" | "error" | "local";
type Tab = "time" | "bill" | "exp";

const C = {
  weekend: "rgba(90, 174, 242, 0.09)",
  open: "rgba(232, 180, 80, 0.14)",
  paid: "rgba(92, 192, 138, 0.11)",
  ot: "#5aaef2",
  boundary: "#6b4a2b",
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
      className={`w-full min-w-0 bg-transparent px-2 py-1.5 rounded-[3px] outline-none placeholder:text-[#f2ead8]/25 focus:bg-[#15110d] focus:ring-2 focus:ring-[#b07d4a] ${
        bad ? "ring-2 ring-[#e8735a] bg-[#15110d]" : ""
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
      className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[13px] font-medium tracking-[0.02em] transition-[background,color,transform] duration-150 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#b07d4a] disabled:opacity-50 ${
        kind === "primary"
          ? "border-[1.5px] border-[#b07d4a] bg-[#b07d4a]/[0.12] font-bold text-[#f2ead8] hover:bg-[#b07d4a] hover:text-black"
          : "border-[1.5px] border-[#f2ead8]/75 text-[#f2ead8] hover:border-[#f2ead8] hover:bg-[#f2ead8] hover:text-black"
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
      className={`mx-auto grid h-7 w-7 place-items-center rounded border border-[#e8735a]/60 text-[#e8735a] hover:bg-[#e8735a]/15 focus-visible:opacity-100 ${
        visible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

const th = "px-2 py-2 text-left text-[12px] font-semibold uppercase tracking-wide text-[#b07d4a] whitespace-nowrap";
const td = "p-0 align-middle border-b border-[#f2ead8]/[0.08]";
const ro = "px-2 py-1.5 whitespace-nowrap tabular-nums";
const mono = { fontFamily: 'ui-monospace, "Cascadia Mono", Consolas, monospace' };

// ---------------------------------------------------------------- summary

function SummaryBlock({ rows, s }: { rows: Row[]; s: State }) {
  const f = summaryFigures(rows, s);
  const h = (v: number) => `${fix2(v)} h`;
  const line = (label: string, hours: number, lieu: number, exp: number | null, strong = false) => (
    <tr className={strong ? "font-semibold" : "text-[#f2ead8]/75"}>
      <td className="py-1 pr-6">{label}</td>
      <td className="py-1 pr-6 tabular-nums">{h(hours)}</td>
      <td className="py-1 pr-6 tabular-nums">{lieuText(lieu, s.fullDayHours)}</td>
      <td className="py-1 tabular-nums">{exp == null ? "" : fmtMoney(exp)}</td>
    </tr>
  );
  return (
    <div className="overflow-x-auto">
      <table className="whitespace-nowrap text-[14px]">
        <thead>
          <tr className="text-[12px] uppercase tracking-wide text-[#a9b0b8]">
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
        <label className="flex items-center gap-2 text-[14px] font-semibold">
          Standard hours per day (including lunch):
          <span className={isRO ? "" : "w-20 rounded-md border border-[#f2ead8]/40"}>
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
        <span className="text-[13px] text-[#a9b0b8]">
          Hours over {fmtShort(s.fullDayHours)} in a day are overtime, and all weekend hours are overtime.
        </span>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-[#b07d4a]/30 bg-black">
        <table className="w-full min-w-[860px] border-collapse text-[14px]">
          <thead className="bg-[#b07d4a]/[0.07]">
            <tr className="border-b border-[#b07d4a]/30">
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
                <td colSpan={9} className="px-4 py-10 text-center text-[#a9b0b8]">
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
                  <td className={`${td} text-center text-[10px] text-[#b07d4a]`} style={line}>
                    {sel ? "▶" : ""}
                  </td>
                  <td className={td} style={{ ...line, ...clientCell(c, s.clientHues) }}>
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
      <div className="overflow-x-auto rounded-[10px] border border-[#b07d4a]/30 bg-black">
        <table className="w-full min-w-[980px] border-collapse text-[14px]">
          <thead className="bg-[#b07d4a]/[0.07]">
            <tr className="border-b border-[#b07d4a]/30">
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
              <th className={th}>Remaining</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-[#a9b0b8]">
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
                  <td className={`${td} text-center text-[10px] text-[#b07d4a]`}>{sel ? "▶" : ""}</td>
                  <td className={td} style={clientCell(p.client, s.clientHues)}>
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
                      className="h-4 w-4 accent-[#b07d4a] disabled:opacity-100"
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
                    <div className={`${ro} ${x.remaining != null && x.remaining < 0 ? "text-[#e8735a]" : ""}`}>
                      {remainingText(x.remaining)}
                    </div>
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
      <div className="overflow-x-auto rounded-[10px] border border-[#b07d4a]/30 bg-black">
        <table className="w-full min-w-[960px] border-collapse text-[14px]">
          <thead className="bg-[#b07d4a]/[0.07]">
            <tr className="border-b border-[#b07d4a]/30">
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
                <td colSpan={9} className="px-4 py-10 text-center text-[#a9b0b8]">
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
                  <td className={`${td} text-center text-[10px] text-[#b07d4a]`}>{sel ? "▶" : ""}</td>
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
                  <td className={td} style={clientCell(x.client, s.clientHues)}>
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
                      className="h-4 w-4 accent-[#b07d4a] disabled:opacity-100"
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
        <span className="text-[#f2ead8]/75">Paid: {fmtMoney(paid)}</span>
        <span className="text-[#f2ead8]/75">Total: {fmtMoney(open + paid)}</span>
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
      <div
        className="grid min-h-screen place-items-center bg-black text-[12px] uppercase tracking-[0.14em] text-[#a9b0b8]"
        style={rootFont}
      >
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
    loading: "#a9b0b8",
    saved: "#5cc08a",
    saving: "#e0a85a",
    error: "#e8735a",
    local: "#e0a85a",
  };

  const banner = "flex flex-wrap items-center gap-3 rounded-lg border border-[#e8735a]/50 bg-[#e8735a]/10 px-4 py-2.5 text-[13px]";

  return (
    <ReadOnly.Provider value={!!viewer}>
      <div className="ch-root min-h-screen bg-black text-[#f2ead8]" style={rootFont}>
        <style>{hubCss}</style>
        {viewer && (
          <div className="border-b border-[#6b4a2b] bg-[#b07d4a]/[0.12] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.18em]">
            Viewing in read-only mode as {viewer}
          </div>
        )}
        <datalist id="ch-clients">
          {clients.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <header className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-4 px-4 pb-6 pt-8">
          <div className="mr-auto flex min-w-0 items-center gap-4">
            <VaBadge />
            <div className="min-w-0">
              <h1 className="text-[16px] font-bold uppercase leading-tight tracking-[0.14em] sm:text-[24px] sm:tracking-[0.24em]">
                Virtually Anything
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium tracking-[0.04em] text-[#a9b0b8]">
                <span>{viewer ? `Timesheet · ${viewer}` : "Timesheet"}</span>
                {!viewer && (
                  <span className="inline-flex items-center gap-1.5 text-[12px]">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: syncColor[sync] }} />
                    {syncText[sync]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!viewer && (
            <div className="flex items-center gap-4">
              <div className="text-right leading-tight">
                <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: clock.on ? "#5cc08a" : "#6b4a2b" }}
                  />
                  {clock.on ? "On" : "Off"}
                </div>
                <div className="mt-1 text-[13px] tabular-nums text-[#a9b0b8]">
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
                className={`inline-flex min-h-[52px] items-center gap-2.5 rounded-lg border-[1.5px] px-5 text-[15px] font-bold tracking-[0.06em] text-[#f2ead8] transition-[background,color,transform] duration-150 hover:-translate-y-px hover:text-black focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#b07d4a] ${
                  clock.on
                    ? "border-[#e8735a] bg-[#e8735a]/[0.14] hover:bg-[#e8735a]"
                    : "border-[#b07d4a] bg-[#b07d4a]/[0.14] hover:bg-[#b07d4a]"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 12V7M12 12l3.5 2.5" />
                </svg>
                {clock.on ? "Clock Off" : "Clock On"}
              </button>
            </div>
          )}
        </header>

        <div className="mx-auto max-w-[1240px] px-4">
          <div className="rounded-[20px] border-2 border-[#6b4a2b] p-1.5">
            <div className="rounded-[14px] border border-[#b07d4a]/25 px-3 pb-6 pt-3 sm:px-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <nav className="-mb-px mr-auto flex gap-1 overflow-x-auto" role="tablist">
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
                      className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        tab === k
                          ? "border-[#b07d4a] text-[#f2ead8]"
                          : "border-transparent text-[#a9b0b8] hover:text-[#f2ead8]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
                <div className="flex flex-wrap gap-2">
                  <Btn onClick={doExport} title="Download every sheet as an Excel workbook">
                    Export to Excel
                  </Btn>
                  <Btn onClick={doCsv} title={`Download the ${tabNames[tab]} tab as a CSV file`}>
                    Export {tabNames[tab]} CSV
                  </Btn>
                  <Btn
                    edits
                    onClick={() => fileRef.current?.click()}
                    title="Import timesheet.csv, billing.csv, expenses.csv, client-colors.csv and settings.ini from the desktop app's records folder"
                  >
                    Import from desktop…
                  </Btn>
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
              <hr className="mb-5 mt-0 h-px border-0 bg-[linear-gradient(90deg,transparent,rgba(176,125,74,0.6),transparent)]" />

              {(sync === "local" || (stale && !viewer)) && (
                <div className="mb-4 space-y-2">
                  {sync === "local" && (
                    <div className={banner}>Cloud storage isn&apos;t connected, so changes are only saved in this browser.</div>
                  )}
                  {stale && !viewer && (
                    <div className={banner}>
                      <span>
                        <b>Missing clock-off:</b> nothing recorded on {fmtDate(stale.date)}.
                      </span>
                      <button
                        type="button"
                        className="font-semibold text-[#b07d4a] hover:underline"
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
              )}

              <main>
                {tab === "time" && <TimesheetTab s={state} rows={rows} update={update} />}
                {tab === "bill" && <BillingTab s={state} rows={rows} update={update} />}
                {tab === "exp" && <ExpensesTab s={state} update={update} />}
              </main>
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 pb-10 pt-6 text-[12px] uppercase tracking-[0.08em] text-[#a9b0b8]">
          <a href="https://virtuallyanything.xyz/" className="opacity-80 hover:text-[#f2ead8] hover:opacity-100">
            virtuallyanything.xyz
          </a>
          <a href="/clienthub/logout" className="opacity-80 hover:text-[#f2ead8] hover:opacity-100">
            Sign out
          </a>
        </footer>
      </div>
    </ReadOnly.Provider>
  );
}

/** The Virtually Anything badge (same artwork as virtuallyanything.xyz/icon.svg). */
function VaBadge() {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      className="h-10 w-10 flex-none rounded-full shadow-[0_0_0_2px_#f2ead8,0_0_0_4px_#6b4a2b] sm:h-11 sm:w-11"
    >
      <rect width="512" height="512" fill="#264653" />
      <circle cx="392" cy="128" r="22" fill="#f2e8cf" opacity="0.9" />
      <ellipse cx="256" cy="420" rx="190" ry="44" fill="#2a9d8f" />
      <rect x="186" y="176" width="140" height="236" rx="70" fill="#e76f51" />
      <circle cx="230" cy="250" r="12" fill="#264653" />
      <circle cx="282" cy="250" r="12" fill="#264653" />
      <path d="M232 292 q24 20 48 0" stroke="#264653" strokeWidth="9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const rootFont: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat), Montserrat, system-ui, -apple-system, "Segoe UI", sans-serif',
  colorScheme: "dark",
};

// Page-wide touches the component's classes can't reach: the site's toast pop-ups, autofill and selection colours.
const hubCss = `
body:has(.ch-root) { background: #000; }
body:has(.ch-root) div:has(> [role="status"]) {
  background: #0d0a07 !important; color: #f2ead8 !important; border: 1px solid rgba(176,125,74,0.55);
  font-family: var(--font-montserrat), Montserrat, system-ui, sans-serif;
}
.ch-root input:-webkit-autofill { -webkit-text-fill-color: #f2ead8; transition: background-color 9999s; }
.ch-root ::selection { background: rgba(176,125,74,0.45); }
.ch-root ::-webkit-scrollbar { height: 10px; width: 10px; }
.ch-root ::-webkit-scrollbar-thumb { background: #3a2a1b; border-radius: 8px; }
`;

/** A client's colour band, with dark text so the name stays readable on the pastel. */
const clientCell = (name: string, hues: Record<string, number>): React.CSSProperties =>
  name ? { background: clientCss(name, hues), color: "#1a1410", fontWeight: 600 } : {};
