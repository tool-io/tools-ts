import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PartialAutocorrelationInput = {
  readonly values: readonly number[];
  readonly maxLag?: number;
};

export type PartialAutocorrelationOutput = {
  readonly coefficients: readonly number[];
  readonly criticalBound: number;
  readonly lagCount: number;
};

export const calculatePartialAutocorrelation = (
  input: PartialAutocorrelationInput,
): PartialAutocorrelationOutput => {
  if (input.values.length < 2)
    return simpleError(
      "values",
      "Provide at least two values.",
      "insufficient_values",
    );
  const lagCap = Math.min(input.values.length - 1, 40);
  const requestedLag = input.maxLag ?? 0;
  if (requestedLag < 0 || requestedLag > lagCap)
    return simpleError(
      "maxLag",
      "The maximum lag must be between zero and the sample size minus one.",
      "invalid_lag_count",
    );
  const count = input.values.length;
  const maxLag = requestedLag === 0 ? lagCap : requestedLag;
  const mean = input.values.reduce((sum, value) => sum + value, 0) / count;
  const centered = input.values.map((value) => value - mean);
  const gamma0 = centered.reduce((sum, value) => sum + value * value, 0);
  if (gamma0 === 0)
    return simpleError(
      "values",
      "Partial autocorrelation needs a series with variation.",
      "constant_series",
    );
  const correlationAt = (lag: number): number =>
    centered.reduce(
      (sum, value, t) => (t >= lag ? sum + value * centered[t - lag]! : sum),
      0,
    ) / gamma0;
  const coefficients: number[] = [];
  let previous: number[] = [];
  for (let k = 1; k <= maxLag; k += 1) {
    let numerator = correlationAt(k);
    let denominator = 1;
    for (let j = 1; j < k; j += 1) {
      numerator -= previous[j - 1]! * correlationAt(k - j);
      denominator -= previous[j - 1]! * correlationAt(j);
    }
    if (!(denominator > 1e-12))
      return simpleError(
        "values",
        "The Durbin-Levinson recursion degenerated before this lag.",
        "degenerate_series",
      );
    const phiKK = numerator / denominator;
    coefficients.push(phiKK);
    const next: number[] = [];
    for (let j = 1; j < k; j += 1)
      next.push(previous[j - 1]! - phiKK * previous[k - j - 1]!);
    next.push(phiKK);
    previous = next;
  }
  return {
    coefficients: coefficients.map((value) => Number(value.toPrecision(12))),
    criticalBound: Number((1.96 / Math.sqrt(count)).toPrecision(12)),
    lagCount: coefficients.length,
  };
};

export const partialAutocorrelationExample = {
  input: {
    values: [3, 5, 6, 4, 7, 8, 5, 6, 9, 8],
  },
  output: {
    coefficients: [
      0.206382978723, -0.235608134625, 0.47411321107, -0.33509686924,
      0.0570614842374, -0.216402687087, -0.0770930705364, -0.236292178157,
      -0.0703557028354,
    ],
    criticalBound: 0.619806421393,
    lagCount: 9,
  },
} satisfies ToolExample<
  PartialAutocorrelationInput,
  PartialAutocorrelationOutput
>;

export const partialAutocorrelationTool = createSimpleTool({
  id: "statistics/partial-autocorrelation",
  title: "Partial Autocorrelation Calculator",
  description:
    "Compute partial autocorrelations with the Durbin-Levinson recursion over the sample autocorrelation sequence (the classical Yule-Walker-style estimator).",
  inputs: [
    {
      description: "Observations in time order.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
    {
      description:
        "Highest lag to report; zero selects the smaller of the sample size minus one and forty.",
      default: 0,
      id: "maxLag",
      kind: "integer",
      label: "Maximum lag",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Partial autocorrelations phi(1,1) through phi(K,K).",
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
  calculate: (input) =>
    calculatePartialAutocorrelation({
      maxLag: input.maxLag as number,
      values: input.values as readonly number[],
    }),
});

export const runPartialAutocorrelation = partialAutocorrelationTool.execute;
export default partialAutocorrelationTool;
