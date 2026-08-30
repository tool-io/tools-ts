import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly studentIds: readonly string[];
  readonly assessmentScores: readonly number[];
  readonly groupCount: number;
}>;
export type Output = Readonly<{
  readonly groupAssignments: readonly string[];
  readonly groupSizes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.studentIds.length;
  if (
    !n ||
    input.assessmentScores.length !== n ||
    new Set(input.studentIds).size !== n ||
    !Number.isSafeInteger(input.groupCount) ||
    input.groupCount < 1 ||
    input.groupCount > n
  )
    simpleError(
      "groupCount",
      "Aligned unique roster and feasible group count required.",
    );
  const sorted = input.studentIds
      .map((id, i) => ({ id, score: input.assessmentScores[i] }))
      .sort((a, b) => a.score - b.score || a.id.localeCompare(b.id)),
    groupAssignments: string[] = [],
    groupSizes: number[] = [];
  let cursor = 0;
  for (let group = 0; group < input.groupCount; group++) {
    const size =
      Math.floor(n / input.groupCount) + Number(group < n % input.groupCount);
    groupSizes.push(size);
    groupAssignments.push(
      sorted
        .slice(cursor, cursor + size)
        .map((v) => v.id)
        .join(","),
    );
    cursor += size;
  }
  return { groupAssignments, groupSizes };
};
export const exampleInput = {
  studentIds: ["A", "B", "C", "D", "E"],
  assessmentScores: [20, 45, 50, 75, 90],
  groupCount: 2,
} satisfies Input;
export const exampleOutput = {
  groupAssignments: ["A,B,C", "D,E"],
  groupSizes: [3, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/flexible-grouping-roster",
  title: "Flexible Grouping Roster",
  description:
    "Regroup learners by current assessment score into balanced contiguous skill bands.",
  inputs: [
    { id: "studentIds", label: "Student ids", kind: "stringList" },
    { id: "assessmentScores", label: "Assessment scores", kind: "numberList" },
    { id: "groupCount", label: "Group count", kind: "number" },
  ],
  outputs: [
    { id: "groupAssignments", label: "Group assignments", kind: "stringList" },
    { id: "groupSizes", label: "Group sizes", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      studentIds: value.studentIds as readonly string[],
      assessmentScores: value.assessmentScores as readonly number[],
      groupCount: value.groupCount as number,
    }),
});
export const run = tool.execute;
export default tool;
