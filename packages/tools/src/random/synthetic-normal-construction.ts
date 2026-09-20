import { randomNormal } from "../probability/normal-box-muller-sampler/tool.js";
import { calculatePearsonCorrelation } from "../statistics/pearson-correlation/tool.js";
import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
export const normalSamplesSchema = {
  type: "array",
  minItems: 1,
  maxItems: 2048,
  items: { type: "number" },
} as const;
export const drawStandardNormal = (random: GeneratorRandom): number => {
  const value = randomNormal(random.unit);
  if (value === null)
    throw new Error(
      "Checked unit draws were rejected by the existing Box–Muller core.",
    );
  return value;
};
export const drawSyntheticNormal = (
  mean: number,
  deviation: number,
  random: GeneratorRandom,
  field: string,
): number => {
  const value = mean + deviation * drawStandardNormal(random);
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "A generated normal observation is not finite.",
      "numeric_overflow",
    );
  return value === 0 ? 0 : value;
};
export const normalizeGeneratedSample = (
  values: readonly number[],
): { values: number[]; constant: boolean } => {
  const scale = Math.max(...values.map(Math.abs)) || 1,
    scaled = values.map((value) => value / scale),
    anchor = scaled[0];
  const centered = scaled.map((value) => value - anchor),
    spread = Math.max(...centered.map(Math.abs));
  return {
    values:
      spread === 0
        ? centered.map(() => 0)
        : centered.map((value) => value / spread),
    constant: spread === 0,
  };
};
/** Positive affine normalization protects the existing coefficient from scale overflow. */
export const generatedPearson = (
  first: readonly number[],
  second: readonly number[],
): number | null => {
  const a = normalizeGeneratedSample(first),
    b = normalizeGeneratedSample(second);
  if (a.constant || b.constant) return null;
  const result = calculatePearsonCorrelation(a.values, b.values);
  if (result === null)
    throw new Error(
      "Nonconstant bounded pairs were rejected by the Pearson core.",
    );
  return Math.max(-1, Math.min(1, result));
};
