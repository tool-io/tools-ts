import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
export type GeneratedModelValueRange = {
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly valueDivisor: number;
};
export const generatedModelValueProperties = {
  minimumValue: { type: "integer" },
  maximumValue: { type: "integer" },
  valueDivisor: { type: "number", exclusiveMinimum: 0 },
} as const;
export const checkGeneratedModelRange = (
  range: GeneratedModelValueRange,
): void => {
  if (range.minimumValue > range.maximumValue)
    simpleError(
      "maximumValue",
      "The inclusive integer-lattice bounds must be ordered.",
      "invalid_value_range",
    );
};
export const generatedModelScalar = (
  range: GeneratedModelValueRange,
  random: GeneratorRandom,
): number => {
  const value =
    random.integer(range.minimumValue, range.maximumValue) / range.valueDivisor;
  if (!Number.isFinite(value))
    return simpleError(
      "valueDivisor",
      "A scaled model entry is not representable as a finite number.",
      "numeric_overflow",
    );
  return value === 0 ? 0 : value;
};
export const generatedModelMatrix = (
  rows: number,
  columns: number,
  range: GeneratedModelValueRange,
  random: GeneratorRandom,
): number[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => generatedModelScalar(range, random)),
  );
