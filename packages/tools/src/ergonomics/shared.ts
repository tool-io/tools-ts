import { simpleError, type SimpleField } from "../core/simple.js";
import { toolResourceLimits } from "../core/limits.js";
import {
  count,
  positive,
  aligned,
  validateInput as validateCoreInput,
} from "../neuroscience/shared.js";
import { shape } from "../archaeology/shared.js";
export * from "../gemology/shared.js";
export { lines, sum, totalCount } from "../museology/shared.js";
export const validateInput = (
  input: unknown,
  fields: readonly SimpleField[],
): void => {
  if (!input || typeof input !== "object" || Array.isArray(input))
    simpleError("input", "An input object required.");
  const record = input as Record<string, unknown>,
    ids = new Set(fields.map((f) => f.id));
  if (Object.keys(record).some((k) => !ids.has(k)))
    simpleError("input", "Unknown input field.");
  for (const f of fields) {
    const v = record[f.id];
    if (
      f.kind === "stringList" &&
      (!Array.isArray(v) ||
        v.length > 128 ||
        v.some((s) => typeof s !== "string" || s.length > 128))
    )
      simpleError(
        f.id,
        "At most 128 strings of at most 128 characters required.",
      );
    if (
      f.kind === "numberList" &&
      Array.isArray(v) &&
      v.length > Math.min(10000, toolResourceLimits.generatedValues)
    )
      simpleError(f.id, "At most 10000 numeric observations required.");
  }
  const coreFields = fields.filter((f) => f.kind !== "stringList");
  validateCoreInput(
    Object.fromEntries(coreFields.map((f) => [f.id, record[f.id]])),
    coreFields,
  );
};
export const bounded = (
  x: number,
  f: string,
  min: number,
  max: number,
): number => {
  count(x, f, min);
  if (x > max) simpleError(f, `Integer at most ${max} required.`);
  return x;
};
export const range = (bounds: readonly number[], f: string): void => {
  if (bounds.length !== 2 || bounds[1] < bounds[0])
    simpleError(f, "Ordered lower/upper endpoint pair required.");
};
export const fit = (
  values: readonly number[],
  lower: number,
  upper: number,
): number[] => values.map((v) => (v >= lower && v <= upper ? 1 : 0));
export const policyMatrix = (
  m: readonly (readonly number[])[],
  rows: number,
  columns: number,
  min = 1,
  max = 9,
): void => {
  if (shape(m, "callerScoreTable") !== columns || m.length !== rows)
    simpleError(
      "table",
      `Caller score matrix must have ${rows} rows and ${columns} columns.`,
    );
  m.forEach((r) => r.forEach((v) => bounded(v, "tableCell", min, max)));
};
export const squaredMean = (
  amplitudes: readonly number[],
  weights: readonly number[],
): number => {
  aligned(amplitudes, weights, "observations");
  weights.forEach((v) => {
    if (v < 0)
      simpleError(
        "weights",
        "Nonnegative represented exposure weights required.",
      );
  });
  const total = positive(
    weights.reduce((a, b) => a + b, 0),
    "totalExposure",
  );
  return amplitudes.reduce((s, v, i) => s + v * v * (weights[i] / total), 0);
};
