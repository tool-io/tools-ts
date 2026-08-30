import { simpleError } from "../core/simple.js";
import { shape } from "../game/shared.js";
export * from "../accounting/batch-shared.js";
export {
  interpolate,
  strictlyIncreasing,
  weights,
} from "../glaciology/batch32-shared.js";
export const points = (rows: readonly (readonly number[])[]): void => {
  if (shape(rows, "points") !== 2)
    simpleError(
      "points",
      "Nonempty caller local planar [x,y] coordinate pairs required; no geodesy/frame inference.",
    );
};
export const modulo = (value: number, period: number): number =>
  ((value % period) + period) % period;
export const sequence = (values: readonly number[], field: string): void => {
  if (
    values.length < 1 ||
    values.some(
      (v, i) => !Number.isFinite(v) || v < 0 || (i > 0 && v < values[i - 1]),
    )
  )
    simpleError(field, "Nonnegative ordered explicit times/counts required.");
};
export const intervals = (
  rows: readonly (readonly number[])[],
  limit: number,
): void => {
  if (!Number.isFinite(limit) || limit < 0)
    return simpleError(
      "intervals",
      "Nonnegative finite observation duration required.",
    );
  if (rows.length === 0) return;
  if (shape(rows, "intervals") !== 2)
    return simpleError(
      "intervals",
      "Explicit start/end interval pairs required.",
    );
  if (rows.some(([a, b]) => a < 0 || b < a || b > limit))
    simpleError("intervals", "Ordered bounded interval endpoints required.");
};
export const unionLength = (
  rows: readonly (readonly number[])[],
  limit: number,
): number => {
  intervals(rows, limit);
  let covered = 0,
    a = 0,
    b = 0;
  for (const [start, end] of rows
    .map((r) => [...r])
    .sort((x, y) => x[0] - y[0])) {
    if (start > b) {
      covered += b - a;
      a = start;
      b = end;
    } else b = Math.max(b, end);
  }
  return covered + b - a;
};
export const safeText = (value: string, field: string): void => {
  if (!value.trim() || value.length > 128)
    simpleError(field, "Nonempty explicit label ≤128 code units required.");
};
export const lookup = (
  ids: readonly string[],
  values: readonly number[],
  id: string,
): number => {
  if (
    !ids.length ||
    ids.length !== values.length ||
    new Set(ids).size !== ids.length
  )
    simpleError(
      "catalog",
      "Distinct aligned caller reference entries required.",
    );
  ids.forEach((v) => safeText(v, "id"));
  safeText(id, "id");
  const i = ids.indexOf(id);
  if (i < 0)
    return simpleError(
      "id",
      "Requested entry not in caller verified catalog; no guessed specification.",
    );
  return values[i];
};
export const matrixFlags = (
  rows: readonly (readonly number[])[],
  width: number,
): void => {
  if (
    shape(rows, "flags") !== width ||
    rows.some((r) => r.some((v) => v !== 0 && v !== 1))
  )
    simpleError("flags", "Aligned explicit binary evidence matrix required.");
};
