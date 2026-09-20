import { simpleError } from "../core/simple.js";
import {
  calculatePopulationSummary,
  type PopulationSummary,
} from "../statistics/population-summary/tool.js";
import { calculatePercentileValue } from "../statistics/percentile-value/tool.js";
import type { GeneratorRandom } from "./generator-random.js";
export const experimentSamplesSchema = {
  type: "array",
  minItems: 1,
  maxItems: 2048,
  items: { type: "number" },
} as const;
export const experimentProbabilitySchema = {
  type: "number",
  minimum: 0,
  maximum: 1,
} as const;
export const experimentPositiveSchema = {
  type: "number",
  exclusiveMinimum: 0,
} as const;
export const experimentSummarySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1 },
    mean: { type: "number" },
    variance: { type: "number", minimum: 0 },
    standardDeviation: { type: "number", minimum: 0 },
  },
  required: ["count", "mean", "variance", "standardDeviation"],
} as const;
/** Existing string-seeded samplers get separate visible substreams from one resolved source. */
export const derivedExperimentSeed = (
  random: GeneratorRandom,
  label: string,
): string => label + ":" + random.integer(0, 0xffffffff);
export const experimentPopulationSummary = (
  values: readonly number[],
  field: string,
): PopulationSummary => {
  const result = calculatePopulationSummary(values);
  if (result === null)
    return simpleError(
      field,
      "The observed population summary is outside the finite numeric range.",
      "numeric_overflow",
    );
  return result;
};
export const experimentQuantile = (
  values: readonly number[],
  percentile: number,
  field: string,
): number => {
  const scale = Math.max(...values.map(Math.abs)) || 1;
  const normalized = values.map((value) => value / scale);
  const result = calculatePercentileValue(normalized, percentile);
  if (result === null)
    throw new Error(
      "Validated observations were rejected by the percentile core.",
    );
  const value = result * scale;
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "The empirical quantile is outside the finite numeric range.",
      "numeric_overflow",
    );
  return value === 0 ? 0 : value;
};
