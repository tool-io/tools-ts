import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly studentIds: readonly string[];
  readonly readinessScores: readonly number[];
  readonly intermediateCutoff: number;
  readonly advancedCutoff: number;
}>;
export type Output = Readonly<{
  readonly foundationIds: readonly string[];
  readonly intermediateIds: readonly string[];
  readonly advancedIds: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.studentIds.length;
  if (
    !n ||
    n !== input.readinessScores.length ||
    new Set(input.studentIds).size !== n ||
    input.intermediateCutoff > input.advancedCutoff
  )
    simpleError(
      "studentIds",
      "Distinct aligned learners and ordered readiness cutoffs required.",
    );
  return {
    foundationIds: input.studentIds.filter(
      (_, i) => input.readinessScores[i] < input.intermediateCutoff,
    ),
    intermediateIds: input.studentIds.filter(
      (_, i) =>
        input.readinessScores[i] >= input.intermediateCutoff &&
        input.readinessScores[i] < input.advancedCutoff,
    ),
    advancedIds: input.studentIds.filter(
      (_, i) => input.readinessScores[i] >= input.advancedCutoff,
    ),
  };
};
export const exampleInput = {
  studentIds: ["A", "B", "C"],
  readinessScores: [20, 60, 90],
  intermediateCutoff: 40,
  advancedCutoff: 80,
} satisfies Input;
export const exampleOutput = {
  foundationIds: ["A"],
  intermediateIds: ["B"],
  advancedIds: ["C"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/readiness-tier-assignments",
  title: "Readiness Tier Assignments",
  description:
    "Assign differentiated activity tiers using current readiness scores.",
  inputs: [
    { id: "studentIds", label: "Student ids", kind: "stringList" },
    { id: "readinessScores", label: "Readiness scores", kind: "numberList" },
    { id: "intermediateCutoff", label: "Intermediate cutoff", kind: "number" },
    { id: "advancedCutoff", label: "Advanced cutoff", kind: "number" },
  ],
  outputs: [
    { id: "foundationIds", label: "Foundation ids", kind: "stringList" },
    { id: "intermediateIds", label: "Intermediate ids", kind: "stringList" },
    { id: "advancedIds", label: "Advanced ids", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      studentIds: value.studentIds as readonly string[],
      readinessScores: value.readinessScores as readonly number[],
      intermediateCutoff: value.intermediateCutoff as number,
      advancedCutoff: value.advancedCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
