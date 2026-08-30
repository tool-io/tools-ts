import { simpleError } from "../core/simple.js";
export {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  ordered,
  mean,
  variance,
  regression,
  integral,
  quantile,
  norm,
} from "../neuroscience/shared.js";
export { maximum, minimum, interpolate } from "../mining/shared.js";
export { crossing } from "../glaciology/shared.js";
import { count, nonnegative, positive } from "../neuroscience/shared.js";
export const allocate = (
  total: number,
  weights: readonly number[],
): number[] => {
  count(total, "total");
  if (!weights.length || weights.length > 128)
    simpleError("weights", "1–128 allocation weights required.");
  weights.forEach((v) => nonnegative(v, "weights"));
  const sum = positive(
      weights.reduce((a, b) => a + b, 0),
      "weights",
    ),
    shares = weights.map((w) => total * (w / sum)),
    result = shares.map(Math.floor),
    remaining = total - result.reduce((a, b) => a + b, 0);
  if (remaining < 0 || remaining > weights.length)
    simpleError("weights", "Allocation precision exceeds safe integer range.");
  const order = shares
    .map((v, i) => ({ i, r: v - result[i] }))
    .sort((a, b) => b.r - a.r || a.i - b.i);
  for (let k = 0; k < remaining; k++) result[order[k].i]++;
  return result;
};
export const dateMs = (value: string): number => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    simpleError("date", "An ISO calendar date YYYY-MM-DD required.");
  const ms = Date.parse(value + "T00:00:00Z");
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== value)
    simpleError("date", "Valid UTC calendar date required.");
  return ms;
};
export const dateShift = (value: string, days: number): string => {
  if (!Number.isSafeInteger(days) || Math.abs(days) > 1000000)
    simpleError("days", "Bounded integer day shift required.");
  const d = new Date(dateMs(value) + days * 86400000);
  if (!Number.isFinite(d.getTime()))
    simpleError("date", "Result outside date range.");
  const out = d.toISOString().slice(0, 10);
  if (!/^\d{4}-/.test(out))
    simpleError("date", "Result outside four-digit calendar-year range.");
  return out;
};
