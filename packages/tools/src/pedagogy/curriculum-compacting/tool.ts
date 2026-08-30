import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly studentIds: readonly string[];
  readonly pretestScores: readonly number[];
  readonly masteryCutoff: number;
}>;
export type Output = Readonly<{
  readonly compactIds: readonly string[];
  readonly reteachIds: readonly string[];
  readonly compactionPercent: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.studentIds.length;
  if (
    !n ||
    n !== input.pretestScores.length ||
    new Set(input.studentIds).size !== n ||
    input.pretestScores.some((v) => v < 0 || v > 100) ||
    input.masteryCutoff < 0 ||
    input.masteryCutoff > 100
  )
    simpleError(
      "pretestScores",
      "Unique roster, 0–100 pretest scores, and cutoff required.",
    );
  const compactIds = input.studentIds.filter(
    (_, i) => input.pretestScores[i] >= input.masteryCutoff,
  );
  return {
    compactIds,
    reteachIds: input.studentIds.filter(
      (_, i) => input.pretestScores[i] < input.masteryCutoff,
    ),
    compactionPercent: (compactIds.length / n) * 100,
  };
};
export const exampleInput = {
  studentIds: ["A", "B", "C"],
  pretestScores: [90, 79, 100],
  masteryCutoff: 80,
} satisfies Input;
export const exampleOutput = {
  compactIds: ["A", "C"],
  reteachIds: ["B"],
  compactionPercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/curriculum-compacting",
  title: "Curriculum Compacting",
  description:
    "Identify mastered pretest objectives eligible for curriculum compacting.",
  inputs: [
    { id: "studentIds", label: "Student ids", kind: "stringList" },
    { id: "pretestScores", label: "Pretest scores", kind: "numberList" },
    { id: "masteryCutoff", label: "Mastery cutoff", kind: "number" },
  ],
  outputs: [
    { id: "compactIds", label: "Compact ids", kind: "stringList" },
    { id: "reteachIds", label: "Reteach ids", kind: "stringList" },
    { id: "compactionPercent", label: "Compaction percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      studentIds: value.studentIds as readonly string[],
      pretestScores: value.pretestScores as readonly number[],
      masteryCutoff: value.masteryCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
