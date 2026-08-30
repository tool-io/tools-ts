import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly standardIds: readonly string[];
  readonly lessonIds: readonly string[];
  readonly alignedStandardIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly uncoveredStandardIds: readonly string[];
  readonly coveredStandardCount: number;
  readonly alignmentPercent: number;
}>;
export const calculate = (input: Input): Output => {
  const standards = new Set(input.standardIds);
  if (
    !standards.size ||
    standards.size !== input.standardIds.length ||
    input.lessonIds.length !== input.alignedStandardIds.length ||
    input.alignedStandardIds.some((v) => !standards.has(v))
  )
    simpleError(
      "alignedStandardIds",
      "Unique standards and aligned lesson/standard pairs required.",
    );
  const aligned = new Set(input.alignedStandardIds),
    uncoveredStandardIds = input.standardIds.filter((v) => !aligned.has(v));
  return {
    uncoveredStandardIds,
    coveredStandardCount: standards.size - uncoveredStandardIds.length,
    alignmentPercent:
      ((standards.size - uncoveredStandardIds.length) / standards.size) * 100,
  };
};
export const exampleInput = {
  standardIds: ["S1", "S2", "S3"],
  lessonIds: ["L1", "L1", "L2"],
  alignedStandardIds: ["S1", "S2", "S2"],
} satisfies Input;
export const exampleOutput = {
  uncoveredStandardIds: ["S3"],
  coveredStandardCount: 2,
  alignmentPercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/curriculum-standards-alignment",
  title: "Curriculum Standards Alignment",
  description:
    "Audit which curriculum standards have lesson alignments and report coverage.",
  inputs: [
    { id: "standardIds", label: "Standard ids", kind: "stringList" },
    { id: "lessonIds", label: "Lesson ids", kind: "stringList" },
    {
      id: "alignedStandardIds",
      label: "Aligned standard ids",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "uncoveredStandardIds",
      label: "Uncovered standard ids",
      kind: "stringList",
    },
    {
      id: "coveredStandardCount",
      label: "Covered standard count",
      kind: "number",
    },
    { id: "alignmentPercent", label: "Alignment percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      standardIds: value.standardIds as readonly string[],
      lessonIds: value.lessonIds as readonly string[],
      alignedStandardIds: value.alignedStandardIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
