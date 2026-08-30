import { simpleError } from "../core/simple.js";
import {
  count,
  positive,
  nonnegative,
  ordered,
  aligned,
} from "../neuroscience/shared.js";
import { shape } from "../archaeology/shared.js";
export * from "../gemology/shared.js";
export { runs } from "../climatology/shared.js";
export const sum = (v: readonly number[]): number =>
  v.reduce((a, b) => a + b, 0);
export const totalCount = (v: readonly number[], field: string): number => {
  v.forEach((x) => count(x, field));
  return count(sum(v), field);
};
export const lines = (
  text: string,
  field: string,
  allowEmpty = false,
): string[] => {
  if (allowEmpty && text === "") return [];
  const r = text.split(/\r?\n/);
  if (
    r.length > 1000 ||
    r.some((v) => !v.length || v !== v.trim() || v.includes("\r"))
  )
    simpleError(
      field,
      "At most 1000 nonempty trimmed newline-separated records required.",
    );
  return r;
};
export const intervalUnion = (
  bounds: readonly (readonly number[])[],
): number[][] => {
  if (shape(bounds, "intervals") !== 2 || bounds.some((r) => r[1] < r[0]))
    simpleError("intervals", "Ordered interval endpoint pairs required.");
  const out: number[][] = [];
  for (const r of [...bounds].sort((a, b) => a[0] - b[0] || a[1] - b[1])) {
    const last = out.at(-1);
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else out.push([...r]);
  }
  return out;
};
export const afterWork = (
  start: number,
  demand: number,
  calendar: readonly number[],
): number => {
  count(start, "startOrdinal");
  count(demand, "workingDays");
  ordered(calendar, "workingCalendar");
  calendar.forEach((v) => count(v, "workingCalendar"));
  if (demand === 0) return start;
  const eligible = calendar.filter((v) => v > start);
  return demand <= eligible.length ? eligible[demand - 1] : -1;
};
export const ledger = (
  matrix: readonly (readonly number[])[],
  field: string,
): void => {
  shape(matrix, field);
  matrix.forEach((r) => r.forEach((v) => nonnegative(v, field)));
};
export const ratioWeighted = (
  values: readonly number[],
  weights: readonly number[],
): number => {
  aligned(values, weights, "exposure");
  weights.forEach((v) => nonnegative(v, "weights"));
  const w = positive(sum(weights), "totalWeight");
  return values.reduce((s, v, i) => s + (v * weights[i]) / w, 0);
};
export const nextFree = (used: readonly number[], start: number): number => {
  used.forEach((v) => count(v, "used"));
  count(start, "start");
  const occupied = new Set(used);
  let n = start;
  while (occupied.has(n)) {
    n++;
    count(n, "nextIdentifier");
  }
  return n;
};
export const accession = (s: string): number[] | undefined => {
  const m = /^([1-9][0-9]{3})\.([1-9][0-9]{0,8})\.([1-9][0-9]{0,8})$/.exec(s);
  return m ? m.slice(1).map(Number) : undefined;
};
export const span = (a: number, b: number, field: string): number => {
  if (b < a) simpleError(field, "Ordered endpoints required.");
  return nonnegative(b - a, field);
};
