import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly categoryNames: readonly string[];
  readonly categoryWeightsPercent: readonly number[];
  readonly tolerancePercent: number;
}>;
export type Output = Readonly<{
  readonly totalWeightPercent: number;
  readonly deviationPercent: number;
  readonly valid: boolean;
}>;
export const calculate = (input: Input): Output => {
  const n = input.categoryNames.length;
  if (
    !n ||
    n !== input.categoryWeightsPercent.length ||
    new Set(input.categoryNames).size !== n ||
    input.categoryWeightsPercent.some((v) => v < 0 || v > 100) ||
    input.tolerancePercent < 0
  )
    simpleError(
      "categoryWeightsPercent",
      "Distinct categories, aligned weights from 0 to 100, and nonnegative tolerance required.",
    );
  const totalWeightPercent = input.categoryWeightsPercent.reduce(
      (a, b) => a + b,
      0,
    ),
    deviationPercent = totalWeightPercent - 100;
  return {
    totalWeightPercent,
    deviationPercent,
    valid: Math.abs(deviationPercent) <= input.tolerancePercent,
  };
};
export const exampleInput = {
  categoryNames: ["tests", "projects", "practice"],
  categoryWeightsPercent: [50, 30, 20],
  tolerancePercent: 0.01,
} satisfies Input;
export const exampleOutput = {
  totalWeightPercent: 100,
  deviationPercent: 0,
  valid: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/grade-weight-validator",
  title: "Grade Weight Validator",
  description:
    "Check whether gradebook category weights sum to 100% within tolerance.",
  inputs: [
    { id: "categoryNames", label: "Category names", kind: "stringList" },
    {
      id: "categoryWeightsPercent",
      label: "Category weights percent",
      kind: "numberList",
    },
    { id: "tolerancePercent", label: "Tolerance percent", kind: "number" },
  ],
  outputs: [
    { id: "totalWeightPercent", label: "Total weight percent", kind: "number" },
    { id: "deviationPercent", label: "Deviation percent", kind: "number" },
    { id: "valid", label: "Valid", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      categoryNames: value.categoryNames as readonly string[],
      categoryWeightsPercent: value.categoryWeightsPercent as readonly number[],
      tolerancePercent: value.tolerancePercent as number,
    }),
});
export const run = tool.execute;
export default tool;
