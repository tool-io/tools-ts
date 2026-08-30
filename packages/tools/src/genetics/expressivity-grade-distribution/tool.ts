import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly severityGrades: readonly number[];
  readonly minimumGrade: number;
  readonly maximumGrade: number;
}>;
export type Output = Readonly<{
  readonly meanGrade: number;
  readonly gradeValues: readonly number[];
  readonly gradeCounts: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  count(input.minimumGrade, "minimumGrade");
  count(input.maximumGrade, "maximumGrade");
  if (
    !input.severityGrades.length ||
    input.maximumGrade < input.minimumGrade ||
    input.severityGrades.some(
      (v) =>
        !Number.isSafeInteger(v) ||
        v < input.minimumGrade ||
        v > input.maximumGrade,
    )
  )
    simpleError(
      "severityGrades",
      "Integer severity grades within the supplied scale required.",
    );
  const counts = new Map<number, number>();
  for (const grade of input.severityGrades)
    counts.set(grade, (counts.get(grade) ?? 0) + 1);
  const gradeValues = [...new Set(input.severityGrades)].sort((a, b) => a - b);
  return {
    meanGrade:
      input.severityGrades.reduce((a, b) => a + b, 0) /
      input.severityGrades.length,
    gradeValues,
    gradeCounts: gradeValues.map((v) => counts.get(v)!),
  };
};
export const exampleInput = {
  severityGrades: [1, 3, 5, 3],
  minimumGrade: 1,
  maximumGrade: 5,
} satisfies Input;
export const exampleOutput = {
  meanGrade: 3,
  gradeValues: [1, 3, 5],
  gradeCounts: [1, 2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/expressivity-grade-distribution",
  title: "Expressivity Grade Distribution",
  description:
    "Summarize a caller-defined ordinal expressivity scale without assigning disease severity from symptoms.",
  inputs: [
    { id: "severityGrades", label: "Severity grades", kind: "numberList" },
    { id: "minimumGrade", label: "Minimum grade", kind: "integer" },
    { id: "maximumGrade", label: "Maximum grade", kind: "integer" },
  ],
  outputs: [
    { id: "meanGrade", label: "Mean grade", kind: "number" },
    { id: "gradeValues", label: "Grade values", kind: "numberList" },
    { id: "gradeCounts", label: "Grade counts", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      severityGrades: value.severityGrades as readonly number[],
      minimumGrade: value.minimumGrade as number,
      maximumGrade: value.maximumGrade as number,
    }),
});
export const run = tool.execute;
export default tool;
