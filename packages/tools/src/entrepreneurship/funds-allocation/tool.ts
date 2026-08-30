import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, positive, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly categories: readonly string[];
  readonly budget: number;
  readonly allocationWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly allocatedAmounts: readonly number[];
  readonly allocationPercent: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.categories, input.allocationWeights, "categories");
  nonnegative(input.budget, "budget");
  const sum = input.allocationWeights.reduce((a, b) => a + b, 0);
  positive(sum, "allocationWeights");
  return {
    allocatedAmounts: input.allocationWeights.map(
      (v) => (input.budget * v) / sum,
    ),
    allocationPercent: input.allocationWeights.map((v) => (100 * v) / sum),
  };
};
export const exampleInput = {
  categories: ["product", "sales"],
  budget: 100000,
  allocationWeights: [3, 2],
} satisfies Input;
export const exampleOutput = {
  allocatedAmounts: [60000, 40000],
  allocationPercent: [60, 40],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/funds-allocation",
  title: "Funds Allocation",
  description:
    "Allocate a funding budget across caller-defined categories and relative weights.",
  inputs: [
    { id: "categories", label: "Categories", kind: "stringList" },
    { id: "budget", label: "Budget", kind: "number" },
    {
      id: "allocationWeights",
      label: "Allocation weights",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "allocatedAmounts", label: "Allocated amounts", kind: "numberList" },
    {
      id: "allocationPercent",
      label: "Allocation percent",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      categories: value.categories as readonly string[],
      budget: value.budget as number,
      allocationWeights: value.allocationWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
