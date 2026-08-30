import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly cohortSizes: readonly number[];
  readonly activeCountsByAge: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly retentionPercent: readonly (readonly number[])[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.cohortSizes.length;
  input.cohortSizes.forEach((v) => count(v, "cohortSizes", 1));
  if (
    !n ||
    input.activeCountsByAge.length !== n ||
    !input.activeCountsByAge[0].length ||
    input.activeCountsByAge.some(
      (row, i) =>
        row.length !== input.activeCountsByAge[0].length ||
        row.some(
          (v) => !Number.isSafeInteger(v) || v < 0 || v > input.cohortSizes[i],
        ),
    )
  )
    simpleError(
      "activeCountsByAge",
      "A rectangular age-aligned cohort count matrix required.",
    );
  return {
    retentionPercent: input.activeCountsByAge.map((row, i) =>
      row.map((v) => (100 * v) / input.cohortSizes[i]),
    ),
  };
};
export const exampleInput = {
  cohortSizes: [100, 50],
  activeCountsByAge: [
    [100, 80, 60],
    [50, 40, 30],
  ],
} satisfies Input;
export const exampleOutput = {
  retentionPercent: [
    [100, 80, 60],
    [100, 80, 60],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/cohort-retention-matrix",
  title: "Cohort Retention Matrix",
  description:
    "Generate age-aligned customer retention percentages for multiple cohorts.",
  inputs: [
    { id: "cohortSizes", label: "Cohort sizes", kind: "numberList" },
    { id: "activeCountsByAge", label: "Active counts by age", kind: "matrix" },
  ],
  outputs: [
    { id: "retentionPercent", label: "Retention percent", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({
      cohortSizes: value.cohortSizes as readonly number[],
      activeCountsByAge:
        value.activeCountsByAge as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
