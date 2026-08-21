import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../input.js";

export type AutocorrelationInput = {
  readonly maxLag?: number;
  readonly values: readonly number[];
};

export type AutocorrelationOutput = {
  readonly coefficients: number[];
  readonly criticalBound: number;
  readonly lagCount: number;
};

const DEFAULT_MAX_LAG = 40;

export const autocorrelationExample = {
  input: { values: [2, 4, 6, 8, 10] },
  output: {
    coefficients: [0.4, -0.1, -0.4, -0.4],
    criticalBound: 0.87653864718,
    lagCount: 4,
  },
} satisfies ToolExample<AutocorrelationInput, AutocorrelationOutput>;

export const calculateAutocorrelation = (
  input: AutocorrelationInput,
): AutocorrelationOutput => {
  const values = input.values as readonly number[];
  if (values.length < 2)
    simpleError(
      "values",
      "Provide at least two values.",
      "insufficient_values",
    );
  const count = values.length;
  const maxLag = input.maxLag ?? Math.min(count - 1, DEFAULT_MAX_LAG);
  if (!Number.isInteger(maxLag) || maxLag < 1 || maxLag > count - 1)
    simpleError(
      "maxLag",
      "The lag count must be between one and one less than the sample size.",
      "invalid_lag_count",
    );
  const mean =
    values.reduce((sum, value) => sum + value, 0) / count;
  let denominator = 0;
  for (const value of values) denominator += (value - mean) ** 2;
  if (denominator === 0)
    simpleError(
      "values",
      "Autocorrelation needs a series with variation.",
      "constant_series",
    );
  const coefficients: number[] = [];
  for (let lag = 1; lag <= maxLag; lag += 1) {
    let numerator = 0;
    for (let t = lag; t < count; t += 1)
      numerator += (values[t]! - mean) * (values[t - lag]! - mean);
    coefficients.push(roundStatistic(numerator / denominator));
  }
  return {
    coefficients,
    criticalBound: roundStatistic(1.96 / Math.sqrt(count)),
    lagCount: coefficients.length,
  };
};

export const autocorrelationTool = createSimpleTool({
  calculate: (input) =>
    calculateAutocorrelation(input as unknown as AutocorrelationInput),
  description:
    "Compute sample autocorrelation coefficients for lags one through a maximum lag.",
  id: "statistics/autocorrelation",
  inputs: [
    {
      description: "Observations in time order.",
      id: "values",
      kind: "numberList",
      label: "Sample",
    },
    {
      description:
        "Highest lag to report; defaults to the smaller of the sample size minus one and forty.",
      id: "maxLag",
      kind: "integer",
      label: "Maximum lag",
      minimum: 1,
      required: false,
    },
  ],
  outputs: [
    {
      description:
        "Coefficients r(1) through r(maxLag) of the centered sample series.",
      id: "coefficients",
      kind: "numberList",
      label: "Coefficients",
    },
    {
      description:
        "Approximate plus-or-minus white-noise significance bound at 1.96 over the square root of the sample size.",
      id: "criticalBound",
      kind: "number",
      label: "Critical bound",
    },
    {
      description: "Number of reported lags.",
      id: "lagCount",
      kind: "integer",
      label: "Lag count",
    },
  ],
  title: "Autocorrelation Calculator",
});
export const runAutocorrelation = autocorrelationTool.execute;
export default autocorrelationTool;
