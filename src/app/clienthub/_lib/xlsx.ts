// Excel (.xlsx) export - a minimal hand-written writer (an .xlsx is a zip of XML files), ported from the
// desktop app. Produces the same four sheets: Timesheet, Billing periods, Expenses, Summary.

import {
  annotate,
  clientFor,
  clientRgb,
  isWeekend,
  periodStats,
  sortExpenses,
  sortPeriods,
  State,
  summaryFigures,
  fmtShort,
} from "./model";

// ---------- zip (stored, no compression) ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(b: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(files: { name: string; data: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.data);
    const crc = crc32(data);

    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(6, 0x0800, true); // UTF-8 names
    lh.setUint16(8, 0, true); // stored
    lh.setUint16(10, dosTime, true);
    lh.setUint16(12, dosDate, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, data.length, true);
    lh.setUint32(22, data.length, true);
    lh.setUint16(26, name.length, true);
    lh.setUint16(28, 0, true);
    chunks.push(new Uint8Array(lh.buffer), name, data);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, dosTime, true);
    ch.setUint16(14, dosDate, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, data.length, true);
    ch.setUint32(24, data.length, true);
    ch.setUint16(28, name.length, true);
    ch.setUint32(42, offset, true);
    central.push(new Uint8Array(ch.buffer), name);

    offset += 30 + name.length + data.length;
  }

  const cdSize = central.reduce((a, c) => a + c.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);

  const all = [...chunks, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((a, c) => a + c.length, 0));
  let p = 0;
  for (const c of all) {
    out.set(c, p);
    p += c.length;
  }
  return out;
}

// ---------- workbook ----------

type V = string | number | { date: string } | { time: number } | null;
type XCell = { v: V; s: number };
type XSheet = { name: string; widths: number[]; rows: XCell[][] };

const NUM_GENERAL = 0,
  NUM_2DP = 2,
  NUM_TIME = 18,
  NUM_DATE = 164,
  NUM_MONEY = 165;

class Styles {
  static readonly General = 0;
  static readonly Bold = 1;
  private xfs = [
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>',
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>',
  ];
  private xfMap = new Map<string, number>();
  private fills = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'];
  private fillMap = new Map<string, number>();

  get(numFmt: number, bold: boolean, fill?: string): number {
    const key = `${numFmt}|${bold}|${fill ?? "-"}`;
    const hit = this.xfMap.get(key);
    if (hit != null) return hit;
    let fillId = 0;
    if (fill) {
      fillId = this.fillMap.get(fill) ?? -1;
      if (fillId < 0) {
        this.fills.push(
          `<fill><patternFill patternType="solid"><fgColor rgb="FF${fill}"/><bgColor indexed="64"/></patternFill></fill>`
        );
        fillId = this.fills.length - 1;
        this.fillMap.set(fill, fillId);
      }
    }
    this.xfs.push(
      `<xf numFmtId="${numFmt}" fontId="${bold ? 1 : 0}" fillId="${fillId}" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"/>`
    );
    const idx = this.xfs.length - 1;
    this.xfMap.set(key, idx);
    return idx;
  }

  xml(): string {
    return (
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<numFmts count="2"><numFmt numFmtId="164" formatCode="ddd dd/mm/yy"/><numFmt numFmtId="165" formatCode="&quot;$&quot;#,##0.00"/></numFmts>' +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
      `<fills count="${this.fills.length}">${this.fills.join("")}</fills>` +
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      `<cellXfs count="${this.xfs.length}">${this.xfs.join("")}</cellXfs>` +
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
      "</styleSheet>"
    );
  }
}

function esc(s: string): string {
  let o = "";
  for (const c of s) {
    if (c === "&") o += "&amp;";
    else if (c === "<") o += "&lt;";
    else if (c === ">") o += "&gt;";
    else if (c === '"') o += "&quot;";
    else if (c.charCodeAt(0) < 32 && c !== "\t" && c !== "\n" && c !== "\r") continue;
    else o += c;
  }
  return o;
}

function colName(i: number): string {
  let s = "";
  for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
  return s;
}

const EXCEL_EPOCH = Date.UTC(1899, 11, 30);
function serialDate(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return (Date.UTC(y, m - 1, d) - EXCEL_EPOCH) / 86400000;
}

function sheetXml(sh: XSheet): string {
  let o =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
  o += "<cols>";
  sh.widths.forEach((w, i) => (o += `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`));
  o += "</cols><sheetData>";
  sh.rows.forEach((row, r) => {
    o += `<row r="${r + 1}">`;
    row.forEach((cell, c) => {
      const ref = colName(c) + (r + 1);
      const v = cell.v;
      if (v == null) o += `<c r="${ref}" s="${cell.s}"/>`;
      else if (typeof v === "string")
        o += `<c r="${ref}" s="${cell.s}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
      else {
        const n = typeof v === "number" ? v : "date" in v ? serialDate(v.date) : v.time / 1440;
        o += `<c r="${ref}" s="${cell.s}"><v>${n}</v></c>`;
      }
    });
    o += "</row>";
  });
  return o + "</sheetData></worksheet>";
}

function workbook(sheets: XSheet[], st: Styles): Uint8Array {
  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  let ct =
    head +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
  sheets.forEach(
    (_, i) =>
      (ct += `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`)
  );
  ct += "</Types>";

  let wb =
    head +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>';
  let rels = head + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
  const files: { name: string; data: string }[] = [
    { name: "[Content_Types].xml", data: ct },
    {
      name: "_rels/.rels",
      data:
        head +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    },
  ];
  sheets.forEach((sh, i) => {
    wb += `<sheet name="${esc(sh.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`;
    rels += `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`;
    files.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(sh) });
  });
  wb += "</sheets></workbook>";
  rels += `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  files.push(
    { name: "xl/workbook.xml", data: wb },
    { name: "xl/_rels/workbook.xml.rels", data: rels },
    { name: "xl/styles.xml", data: st.xml() }
  );
  return zip(files);
}

const hex = ([r, g, b]: [number, number, number]) =>
  [r, g, b].map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("");

/** Builds the whole workbook (days, billing periods, expenses, summary). */
export function buildWorkbook(s: State): Uint8Array {
  const days = annotate(s.entries, s.fullDayHours);
  const st = new Styles();
  const c = (v: V, sIdx: number): XCell => ({ v, s: sIdx });
  const weekendFill = "D6E8FA";
  const hdr = Styles.Bold;
  const date = st.get(NUM_DATE, false),
    time = st.get(NUM_TIME, false),
    num = st.get(NUM_2DP, false),
    money = st.get(NUM_MONEY, false),
    numBold = st.get(NUM_2DP, true);
  const clientStyle = (name: string) => st.get(NUM_GENERAL, false, hex(clientRgb(name, s.clientHues)));
  const sheets: XSheet[] = [];

  // --- Timesheet ---
  const ts: XSheet = { name: "Timesheet", widths: [18, 15, 11, 11, 9, 10, 40], rows: [] };
  ts.rows.push(["Client", "Date", "Clock On", "Clock Off", "Hours", "Overtime", "Note"].map((h) => c(h, hdr)));
  for (const e of days) {
    const client = e.client || clientFor(e.date, s.periods);
    const wk = isWeekend(e.date);
    const fill = wk ? weekendFill : undefined;
    const sDate = wk ? st.get(NUM_DATE, false, fill) : date;
    const sTime = wk ? st.get(NUM_TIME, false, fill) : time;
    const sNum = wk ? st.get(NUM_2DP, false, fill) : num;
    const sTxt = wk ? st.get(NUM_GENERAL, false, fill) : Styles.General;
    ts.rows.push([
      c(client || null, client ? clientStyle(client) : sTxt),
      c({ date: e.date }, sDate),
      c(e.on != null ? { time: e.on } : null, sTime),
      c(e.off != null ? { time: e.off } : null, sTime),
      c(e.hours, sNum),
      c(e.overtime, sNum),
      c(e.note || null, sTxt),
    ]);
  }
  ts.rows.push([
    c("Total", hdr),
    c(null, 0),
    c(null, 0),
    c(null, 0),
    c(days.reduce((a, x) => a + (x.hours ?? 0), 0), numBold),
    c(days.reduce((a, x) => a + (x.overtime ?? 0), 0), numBold),
    c(null, 0),
  ]);
  sheets.push(ts);

  // --- Billing periods ---
  const bp: XSheet = { name: "Billing periods", widths: [18, 15, 15, 14, 8, 10, 10, 10, 11, 12], rows: [] };
  bp.rows.push(
    ["Client", "From", "To", "Hours to bill", "Paid", "Regular", "Overtime", "Worked", "Expenses", "Remaining"].map((h) =>
      c(h, hdr)
    )
  );
  for (const p of sortPeriods(s.periods)) {
    const x = periodStats(p, days, s.expenses);
    bp.rows.push([
      c(p.client || null, p.client ? clientStyle(p.client) : 0),
      c({ date: p.from }, date),
      c({ date: p.to }, date),
      c(p.hours, num),
      c(p.paid ? "Yes" : "No", 0),
      c(x.reg, num),
      c(x.ot, num),
      c(x.worked, num),
      c(x.expenses, money),
      c(x.remaining, num),
    ]);
  }
  sheets.push(bp);

  // --- Expenses ---
  const ex: XSheet = { name: "Expenses", widths: [15, 18, 28, 22, 28, 11, 8], rows: [] };
  ex.rows.push(["Date", "Client", "Item", "Company", "Use", "Price", "Paid"].map((h) => c(h, hdr)));
  for (const x of sortExpenses(s.expenses))
    ex.rows.push([
      c({ date: x.date }, date),
      c(x.client || null, x.client ? clientStyle(x.client) : 0),
      c(x.item, 0),
      c(x.company, 0),
      c(x.use || null, 0),
      c(x.price, money),
      c(x.paid ? "Yes" : "No", 0),
    ]);
  ex.rows.push([
    c("Total", hdr),
    c(null, 0),
    c(null, 0),
    c(null, 0),
    c(null, 0),
    c(s.expenses.reduce((a, x) => a + x.price, 0), st.get(NUM_MONEY, true)),
    c(null, 0),
  ]);
  sheets.push(ex);

  // --- Summary ---
  const f = summaryFigures(days, s);
  const dl = s.fullDayHours;
  const sm: XSheet = { name: "Summary", widths: [14, 10, 18, 18, 12], rows: [] };
  sm.rows.push([c("", hdr), c("Hours", hdr), c("Time in lieu (h)", hdr), c("Time in lieu (days)", hdr), c("Expenses", hdr)]);
  sm.rows.push([
    c("Outstanding", hdr),
    c(f.totalH - f.claimedH, num),
    c(f.totalO - f.claimedO, num),
    c((f.totalO - f.claimedO) / dl, num),
    c(f.outX, money),
  ]);
  sm.rows.push([c("Total", hdr), c(f.totalH, num), c(f.totalO, num), c(f.totalO / dl, num), c(null, 0)]);
  sm.rows.push([c("Claimed", hdr), c(f.claimedH, num), c(f.claimedO, num), c(f.claimedO / dl, num), c(f.claimedX, money)]);
  sm.rows.push([]);
  sm.rows.push([
    c(`A full day is ${fmtShort(dl)} hours (including lunch); time in lieu days = hours / ${fmtShort(dl)}.`, 0),
  ]);
  sheets.push(sm);

  return workbook(sheets, st);
}
