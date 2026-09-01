import { simpleError as fail, type SimpleField } from "../core/simple.js";
import {
  validateInput as validateBase,
  finish as finishBase,
  aligned,
  bounded,
  positive,
  sum,
  finite,
  shape,
  unique,
} from "../astronomy/batch41-shared.js";
export * from "../astronomy/batch41-shared.js";
export function simpleError(field: string, message: string): never {
  return fail(field, message);
}
export const validateInput = (
  input: unknown,
  fields: readonly SimpleField[],
): void => {
  validateBase(input, fields);
  if (fields.some((f) => !Object.hasOwn(input as object, f.id)))
    fail("input", "Every field requires an explicit own value.");
};
export const finish = <T extends Readonly<Record<string, unknown>>>(
  value: T,
): T => {
  finishBase(value);
  if (JSON.stringify(value).length > 1_048_576)
    fail("output", "Composite output exceeds 1,048,576 UTF-16 units.");
  return value;
};
// Common Petra Sancta hatching, viewer x-right/y-down; angles clockwise from x.
// Includes blank/stippled metals: an angle alone cannot encode every tincture.
export const hatchingPatterns = {
  or: { lineAnglesDegrees: [], stippled: true },
  argent: { lineAnglesDegrees: [], stippled: false },
  gules: { lineAnglesDegrees: [90], stippled: false },
  azure: { lineAnglesDegrees: [0], stippled: false },
  sable: { lineAnglesDegrees: [0, 90], stippled: false },
  vert: { lineAnglesDegrees: [45], stippled: false },
  purpure: { lineAnglesDegrees: [135], stippled: false },
} as const;
export const featureClasses = (
  features: readonly number[],
  known: readonly number[],
  names: readonly string[],
  rules: readonly (readonly number[])[],
): {
  compatibleClasses: string[];
  witnessedClasses: string[];
  unknownFeatureIndices: number[];
} => {
  aligned(features, known, "features");
  aligned(names, rules, "classes");
  features.forEach((v) => bounded(v, "feature", 0, 1));
  known.forEach((v) => bounded(v, "known", 0, 1));
  if (
    shape(rules, "rules") !== features.length ||
    rules.some((r) => r.some((v) => ![-1, 0, 1].includes(v)))
  )
    fail("features", "Correct fixed feature dimensions required.");
  return {
    compatibleClasses: names.filter((_, i) =>
      rules[i].every((v, j) => v === -1 || !known[j] || features[j] === v),
    ),
    witnessedClasses: names.filter((_, i) =>
      rules[i].every((v, j) => v === -1 || (!!known[j] && features[j] === v)),
    ),
    unknownFeatureIndices: known.flatMap((v, i) => (v ? [] : [i])),
  };
};
export const canvas = (width: number, height: number): void => {
  positive(width, "width");
  positive(height, "height");
  if (Math.max(width, height) > 1e9)
    fail("canvas", "Dimensions bounded to 1e9 in one declared unit.");
};
export const unitPoints = (p: readonly (readonly number[])[]): void => {
  if (shape(p, "points") !== 2)
    fail("points", "Explicit x, y coordinate pairs.");
  p.forEach((r) =>
    r.forEach((v) => {
      if (v < 0 || v > 1)
        fail(
          "point",
          "Normalized 0–1 points within the declared rectangular envelope.",
        );
    }),
  );
};
export const bands = (
  extent: number,
  weights: readonly number[],
): { boundaries: number[]; widths: number[] } => {
  positive(extent, "extent");
  weights.forEach((v) => positive(v, "weight"));
  const t = positive(sum(weights), "total weight"),
    widths = weights.map((v) => finite((extent * v) / t));
  let x = 0;
  return { widths, boundaries: [0, ...widths.map((v) => (x = finite(x + v)))] };
};
export const stripedGrid = (
  width: number,
  height: number,
  rows: number,
  cols: number,
): { centers: number[][]; cellWidth: number; cellHeight: number } => {
  canvas(width, height);
  bounded(rows, "rows", 1, 64);
  bounded(cols, "columns", 1, 64);
  if (rows * cols > 128) fail("grid", "At most 128 explicit layout cells.");
  return {
    centers: Array.from({ length: rows * cols }, (_, i) => [
      (((i % cols) + 0.5) * width) / cols,
      ((Math.floor(i / cols) + 0.5) * height) / rows,
    ]),
    cellWidth: width / cols,
    cellHeight: height / rows,
  };
};
export const histogram = (
  tokens: readonly string[],
): { tokens: string[]; counts: number[] } => {
  if (!tokens.length || tokens.some((v) => !v.trim()))
    fail("tokens", "Nonempty explicit annotated inventory required.");
  const keys = [...new Set(tokens)];
  return {
    tokens: keys,
    counts: keys.map((k) => tokens.filter((v) => v === k).length),
  };
};
export const weightedCoverage = (
  weights: readonly number[],
  flags: readonly number[],
  known: readonly number[],
): { witnessedFraction: number; unknownWeightFraction: number } => {
  aligned(weights, flags, "weights");
  aligned(weights, known, "known");
  weights.forEach((v) => {
    if (v < 0) fail("weight", "Nonnegative weights.");
  });
  flags.forEach((v) => bounded(v, "flag", 0, 1));
  known.forEach((v) => bounded(v, "known", 0, 1));
  const t = positive(sum(weights), "total");
  return {
    witnessedFraction: sum(weights.map((v, i) => v * flags[i] * known[i])) / t,
    unknownWeightFraction: sum(weights.map((v, i) => v * (1 - known[i]))) / t,
  };
};
export const tokenInventory = (s: string): string[] => {
  if (s.length > 8192)
    fail(
      "text",
      "Bounded 8,192 UTF-16-unit lexical text, not a semantic parse.",
    );
  return s.trim() ? s.trim().split(/\s+/u) : [];
};
export const exactTranslations = (
  queries: readonly string[],
  from: readonly string[],
  to: readonly string[],
): string[] => {
  aligned(from, to, "crosswalk");
  unique(from, "reference keys");
  return queries.map((q) => {
    const i = from.indexOf(q);
    if (i < 0)
      fail(
        "query",
        "Unknown caller independently verified source/edition term.",
      );
    return to[i];
  });
};
export const similarity = (
  a: readonly string[],
  b: readonly string[],
  weights: readonly number[],
): { weightedExactSimilarity: number; differentIndices: number[] } => {
  aligned(a, b, "annotatedattributes");
  aligned(a, weights, "weights");
  weights.forEach((v) => {
    if (v < 0) fail("weight", "Nonnegative independently specified weights.");
  });
  const t = positive(sum(weights), "totalweight");
  return {
    weightedExactSimilarity:
      sum(weights.map((v, i) => v * (a[i] === b[i] ? 1 : 0))) / t,
    differentIndices: a.flatMap((v, i) => (v === b[i] ? [] : [i])),
  };
};
