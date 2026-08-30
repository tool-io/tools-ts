import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sharedCost: number;
  readonly partnerWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly allocatedCosts: readonly number[];
  readonly weightTotal: number;
  readonly allocationTotal: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.partnerWeights.length === 0 ||
    input.partnerWeights.some((value) => value < 0)
  )
    simpleError(
      "partnerWeights",
      "Partner weights must be nonempty and nonnegative.",
      "invalid_weights",
    );
  const weightTotal = input.partnerWeights.reduce((a, b) => a + b, 0);
  if (weightTotal <= 0)
    simpleError(
      "partnerWeights",
      "At least one weight must be positive.",
      "zero_weights",
    );
  const allocatedCosts = input.partnerWeights.map(
    (value) => (input.sharedCost * value) / weightTotal,
  );
  return {
    allocatedCosts,
    weightTotal,
    allocationTotal: allocatedCosts.reduce((a, b) => a + b, 0),
  };
};

export const exampleInput = {
  sharedCost: 1000,
  partnerWeights: [1, 3],
} satisfies Input;
export const exampleOutput = {
  allocatedCosts: [250, 750],
  weightTotal: 4,
  allocationTotal: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sharedCost: input.sharedCost as number,
      partnerWeights: input.partnerWeights as readonly number[],
    }),
  description:
    "Allocate shared co-production costs by caller-supplied partner weights.",
  id: "theatre/coproduction-cost-allocation",
  inputs: [
    {
      id: "sharedCost",
      label: "Shared production cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "partnerWeights",
      label: "Partner allocation weights",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "allocatedCosts",
      label: "Allocated partner costs",
      kind: "numberList",
    },
    {
      id: "weightTotal",
      label: "Total allocation weight",
      kind: "number",
      minimum: 0,
    },
    {
      id: "allocationTotal",
      label: "Allocated cost total",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Co-Production Cost Allocation",
});

export const run = tool.execute;
export default tool;
