import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly studentIds: readonly string[];
  readonly priorCallCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly nextStudentId: string;
  readonly callCountSpread: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.studentIds.length;
  if (
    !n ||
    n !== input.priorCallCounts.length ||
    new Set(input.studentIds).size !== n ||
    input.priorCallCounts.some((v) => !Number.isSafeInteger(v) || v < 0)
  )
    simpleError(
      "studentIds",
      "Distinct learners and aligned nonnegative call counts required.",
    );
  const min = Math.min(...input.priorCallCounts),
    max = Math.max(...input.priorCallCounts);
  return {
    nextStudentId: input.studentIds[input.priorCallCounts.indexOf(min)],
    callCountSpread: max - min,
  };
};
export const exampleInput = {
  studentIds: ["A", "B", "C"],
  priorCallCounts: [2, 0, 1],
} satisfies Input;
export const exampleOutput = {
  nextStudentId: "B",
  callCountSpread: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/cold-call-equity-roster",
  title: "Cold Call Equity Roster",
  description: "Choose the least-called learner and measure call-count equity.",
  inputs: [
    { id: "studentIds", label: "Student ids", kind: "stringList" },
    { id: "priorCallCounts", label: "Prior call counts", kind: "numberList" },
  ],
  outputs: [
    { id: "nextStudentId", label: "Next student id", kind: "string" },
    { id: "callCountSpread", label: "Call count spread", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      studentIds: value.studentIds as readonly string[],
      priorCallCounts: value.priorCallCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
