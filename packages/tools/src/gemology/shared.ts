import { simpleError } from "../core/simple.js";
import {
  positive,
  nonnegative,
  fraction,
  ordered,
  norm,
  count,
} from "../neuroscience/shared.js";
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
  median,
  regression,
  integral,
  quantile,
  norm,
} from "../neuroscience/shared.js";
export { maximum, minimum, interpolate } from "../mining/shared.js";
export { crossing } from "../glaciology/shared.js";
export { shape } from "../archaeology/shared.js";
export const bands = (edges: readonly number[], value: number): number => {
  ordered(edges, "lowerEdges");
  if (edges.length > 128 || value < edges[0])
    simpleError(
      "lowerEdges",
      "At most 128 bands covering supplied value required.",
    );
  const i = edges.findIndex((e) => e > value);
  return i < 0 ? edges.length - 1 : i - 1;
};
export const unit = (v: readonly number[], field: string): number[] => {
  if (v.length !== 3)
    simpleError(
      field,
      "Three components for a measured plane normal required.",
    );
  const d = positive(norm(v), field);
  return v.map((x) => x / d);
};
export const roundGeometry = (
  diameter: number,
  table: number,
  culet: number,
  crown: number,
  girdle: number,
  pavilion: number,
): void => {
  positive(diameter, "diameter");
  [table, culet, crown, girdle, pavilion].forEach((v) =>
    nonnegative(v, "geometry"),
  );
  if (table > diameter || culet > diameter)
    simpleError(
      "geometry",
      "Table/culet cannot exceed girdle diameter in coaxial-frustum model.",
    );
};
export const safeCeil = (x: number, field: string): number => {
  if (!Number.isFinite(x) || x < 0 || x > Number.MAX_SAFE_INTEGER)
    simpleError(field, "Finite nonnegative exactly countable demand required.");
  return Math.ceil(x);
};
export const rowInventory = (
  counts: readonly number[],
  perUnit: readonly number[],
): number => {
  if (!counts.length || counts.length !== perUnit.length)
    simpleError("inventory", "Aligned nonempty count/unit inventory required.");
  counts.forEach((v) => {
    if (!Number.isSafeInteger(v) || v < 0)
      simpleError("counts", "Nonnegative safe integer counts required.");
  });
  perUnit.forEach((v) => nonnegative(v, "perUnit"));
  return count(
    counts.reduce((s, v, i) => s + v * perUnit[i], 0),
    "inventoryTotal",
  );
};
export const integerSpan = (
  length: number,
  spacing: number,
  start: number,
  end: number,
): number => {
  nonnegative(length, "length");
  positive(spacing, "spacing");
  nonnegative(start, "startInset");
  nonnegative(end, "endInset");
  const usable = length - start - end;
  if (usable < 0) return 0;
  const n = Math.floor(usable / spacing) + 1;
  if (!Number.isSafeInteger(n))
    simpleError("count", "Count exceeds safe integer range.");
  return n;
};
export const binary = (x: readonly number[], field: string): void => {
  x.forEach((v) => {
    if (v !== 0 && v !== 1)
      simpleError(field, "Binary observation flags required.");
  });
};
