import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RiskParityAllocation = {
  readonly riskContributions: readonly number[];
  readonly weights: readonly number[];
};

export const calculateRiskParity = (
  covariance: readonly (readonly number[])[],
  iterations: number,
): RiskParityAllocation | null => {
  const count = covariance.length;
  if (
    !count ||
    covariance.some((row) => row.length !== count) ||
    covariance.some((row, index) => (row[index] ?? 0) <= 0)
  )
    return null;
  for (let row = 0; row < count; row += 1)
    for (let column = 0; column < count; column += 1)
      if (
        Math.abs(
          (covariance[row]?.[column] ?? 0) - (covariance[column]?.[row] ?? 0),
        ) > 1e-9
      )
        return null;

  let weights = Array<number>(count).fill(1 / count);
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const marginal = covariance.map((row) =>
      row.reduce((sum, value, index) => sum + value * (weights[index] ?? 0), 0),
    );
    const variance = weights.reduce(
      (sum, weight, index) => sum + weight * (marginal[index] ?? 0),
      0,
    );
    if (!(variance > 0)) return null;
    const contributions = weights.map(
      (weight, index) => (weight * (marginal[index] ?? 0)) / variance,
    );
    if (contributions.some((value) => !(value > 0))) return null;
    weights = weights.map(
      (weight, index) =>
        weight * Math.sqrt(1 / count / (contributions[index] ?? 0)),
    );
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    weights = weights.map((weight) => weight / total);
  }
  const marginal = covariance.map((row) =>
    row.reduce((sum, value, index) => sum + value * (weights[index] ?? 0), 0),
  );
  const variance = weights.reduce(
    (sum, weight, index) => sum + weight * (marginal[index] ?? 0),
    0,
  );
  return {
    riskContributions: weights.map((weight, index) =>
      Number(((weight * (marginal[index] ?? 0)) / variance).toPrecision(8)),
    ),
    weights: weights.map((value) => Number(value.toPrecision(8))),
  };
};

export const riskParityExample = {
  input: {
    covariance: [
      [0.04, 0.006],
      [0.006, 0.09],
    ],
    iterations: 500,
  },
  output: {
    allocation: { riskContributions: [0.5, 0.5], weights: [0.6, 0.4] },
  },
} satisfies ToolExample<
  {
    readonly covariance: readonly (readonly number[])[];
    readonly iterations: number;
  },
  { readonly allocation: RiskParityAllocation }
>;

export const riskParityTool = createSimpleTool({
  id: "finance/risk-parity",
  title: "Risk-Parity Portfolio Calculator",
  description:
    "Estimate long-only equal-risk-contribution weights from a covariance matrix.",
  inputs: [
    {
      format: "matrix/covariance",
      id: "covariance",
      kind: "matrix",
      label: "Covariance matrix",
    },
    {
      id: "iterations",
      kind: "integer",
      label: "Iterations",
      maximum: 100_000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "portfolio/risk-parity",
      id: "allocation",
      kind: "object",
      label: "Risk-parity allocation",
    },
  ],
  calculate: (input) => {
    const allocation = calculateRiskParity(
      input.covariance as number[][],
      input.iterations as number,
    );
    if (!allocation)
      return simpleError(
        "covariance",
        "Enter a symmetric positive-diagonal covariance matrix.",
      );
    return { allocation };
  },
});

export const runRiskParity = riskParityTool.execute;
export default riskParityTool;
