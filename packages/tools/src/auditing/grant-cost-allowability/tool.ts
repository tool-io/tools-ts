import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly testedCostAmounts: readonly number[];
  readonly allowabilityFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly testedTotal: number;
  readonly allowableTotal: number;
  readonly questionedCostTotal: number;
  readonly questionedCostPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.testedCostAmounts.length;
  if (
    n === 0 ||
    input.allowabilityFlags.length !== n ||
    input.testedCostAmounts.some((value) => value < 0) ||
    input.allowabilityFlags.some((value) => value !== 0 && value !== 1)
  )
    simpleError(
      "testedCostAmounts",
      "Aligned nonnegative costs and binary flags are required.",
      "invalid_costs",
    );
  const testedTotal = input.testedCostAmounts.reduce((a, b) => a + b, 0),
    allowableTotal = input.testedCostAmounts.reduce(
      (sum, value, index) =>
        sum + (input.allowabilityFlags[index] === 1 ? value : 0),
      0,
    );
  return {
    testedTotal,
    allowableTotal,
    questionedCostTotal: testedTotal - allowableTotal,
    questionedCostPercent:
      testedTotal === 0
        ? 0
        : ((testedTotal - allowableTotal) / testedTotal) * 100,
  };
};

export const exampleInput = {
  testedCostAmounts: [100, 200, 300],
  allowabilityFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  testedTotal: 600,
  allowableTotal: 400,
  questionedCostTotal: 200,
  questionedCostPercent: 33.33333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      testedCostAmounts: input.testedCostAmounts as readonly number[],
      allowabilityFlags: input.allowabilityFlags as readonly number[],
    }),
  description:
    "Summarize allowable and questioned costs in a tested grant sample.",
  id: "auditing/grant-cost-allowability",
  inputs: [
    {
      id: "testedCostAmounts",
      label: "Tested grant costs",
      kind: "numberList",
    },
    {
      id: "allowabilityFlags",
      label: "Allowability flags as one or zero",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "testedTotal",
      label: "Total tested costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "allowableTotal",
      label: "Allowable tested costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "questionedCostTotal",
      label: "Questioned tested costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "questionedCostPercent",
      label: "Questioned cost share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Grant Cost Allowability",
});

export const run = tool.execute;
export default tool;
