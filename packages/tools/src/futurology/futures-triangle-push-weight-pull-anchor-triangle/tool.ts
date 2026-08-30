import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuturesTriangleInput = {
  readonly pullStrengths: ReadonlyArray<number>;
  readonly pushStrengths: ReadonlyArray<number>;
  readonly weightStrengths: ReadonlyArray<number>;
};

export type FuturesTriangleOutput = {
  readonly balanceDifference: number;
  readonly dominantForce: "balance" | "pull" | "push" | "weight";
  readonly forceTotals: ReadonlyArray<number>;
};

export const calculateFuturesTriangleBalance = (
  input: FuturesTriangleInput,
): FuturesTriangleOutput => {
  if (
    !Array.isArray(input.pushStrengths) ||
    !Array.isArray(input.weightStrengths) ||
    !Array.isArray(input.pullStrengths)
  )
    simpleError(
      "",
      "Push, weight, and pull strengths must be arrays.",
      "triangle_data_required",
    );
  const sum = (values: ReadonlyArray<number>, field: string): number => {
    let total = 0;
    for (const [index, value] of values.entries()) {
      if (!Number.isFinite(value) || value < 0)
        simpleError(
          `${field}.${index}`,
          "Strengths must be finite and nonnegative.",
          "invalid_strength",
        );
      total += value;
      if (!Number.isFinite(total))
        simpleError(
          `${field}.${index}`,
          "Strength total is not finite.",
          "result_not_finite",
        );
    }
    return total;
  };
  const push = sum(input.pushStrengths, "pushStrengths");
  const weight = sum(input.weightStrengths, "weightStrengths");
  const pull = sum(input.pullStrengths, "pullStrengths");
  const balanceDifference = push + weight - pull;
  if (!Number.isFinite(balanceDifference))
    simpleError(
      "pullStrengths",
      "Balance difference is not finite.",
      "result_not_finite",
    );
  const maximum = Math.max(push, weight, pull);
  const totalsBalanced = balanceDifference === 0;
  return {
    balanceDifference: totalsBalanced ? 0 : balanceDifference,
    dominantForce: totalsBalanced
      ? "balance"
      : maximum === push
        ? "push"
        : maximum === weight
          ? "weight"
          : "pull",
    forceTotals: [push, weight, pull],
  };
};

export const futuresTriangleExample = {
  input: {
    pullStrengths: [3, 2],
    pushStrengths: [4, 1],
    weightStrengths: [2, 2],
  },
  output: {
    balanceDifference: 4,
    dominantForce: "push",
    forceTotals: [5, 4, 5],
  },
} satisfies ToolExample<FuturesTriangleInput, FuturesTriangleOutput>;

export const futuresTriangleTool = createSimpleTool({
  calculate: (input) =>
    calculateFuturesTriangleBalance({
      pullStrengths: input.pullStrengths as number[],
      pushStrengths: input.pushStrengths as number[],
      weightStrengths: input.weightStrengths as number[],
    }),
  description:
    "Sum caller-supplied push, weight, and pull strengths and report their net balance and dominant force.",
  id: "futurology/futures-triangle-push-weight-pull-anchor-triangle",
  inputs: [
    { id: "pullStrengths", kind: "numberList", label: "Pull strengths" },
    { id: "pushStrengths", kind: "numberList", label: "Push strengths" },
    { id: "weightStrengths", kind: "numberList", label: "Weight strengths" },
  ],
  outputs: [
    {
      id: "balanceDifference",
      kind: "number",
      label: "Push plus weight minus pull",
    },
    {
      enum: ["balance", "pull", "push", "weight"],
      id: "dominantForce",
      kind: "string",
      label: "Dominant force",
    },
    { id: "forceTotals", kind: "numberList", label: "Force totals" },
  ],
  title: "Futures Triangle Push Weight Pull Anchor Triangle",
});

export const runFuturesTriangle = futuresTriangleTool.execute;
export default futuresTriangleTool;
