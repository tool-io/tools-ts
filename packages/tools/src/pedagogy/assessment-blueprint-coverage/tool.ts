import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly objectiveIds: readonly string[];
  readonly itemObjectiveIds: readonly string[];
  readonly minimumItemsPerObjective: number;
}>;
export type Output = Readonly<{
  readonly itemCounts: readonly number[];
  readonly uncoveredObjectiveIds: readonly string[];
  readonly coveragePercent: number;
}>;
export const calculate = (input: Input): Output => {
  const ids = input.objectiveIds;
  if (
    !ids.length ||
    new Set(ids).size !== ids.length ||
    input.itemObjectiveIds.some((v) => !ids.includes(v)) ||
    !Number.isSafeInteger(input.minimumItemsPerObjective) ||
    input.minimumItemsPerObjective < 1
  )
    simpleError(
      "objectiveIds",
      "Distinct objectives, assigned items, and positive minimum required.",
    );
  const itemCounts = ids.map(
      (id) => input.itemObjectiveIds.filter((v) => v === id).length,
    ),
    uncoveredObjectiveIds = ids.filter(
      (_, i) => itemCounts[i] < input.minimumItemsPerObjective,
    );
  return {
    itemCounts,
    uncoveredObjectiveIds,
    coveragePercent:
      ((ids.length - uncoveredObjectiveIds.length) / ids.length) * 100,
  };
};
export const exampleInput = {
  objectiveIds: ["O1", "O2", "O3"],
  itemObjectiveIds: ["O1", "O2", "O1"],
  minimumItemsPerObjective: 1,
} satisfies Input;
export const exampleOutput = {
  itemCounts: [2, 1, 0],
  uncoveredObjectiveIds: ["O3"],
  coveragePercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/assessment-blueprint-coverage",
  title: "Assessment Blueprint Coverage",
  description:
    "Audit test-item counts against objectives and a caller-selected coverage minimum.",
  inputs: [
    { id: "objectiveIds", label: "Objective ids", kind: "stringList" },
    { id: "itemObjectiveIds", label: "Item objective ids", kind: "stringList" },
    {
      id: "minimumItemsPerObjective",
      label: "Minimum items per objective",
      kind: "number",
    },
  ],
  outputs: [
    { id: "itemCounts", label: "Item counts", kind: "numberList" },
    {
      id: "uncoveredObjectiveIds",
      label: "Uncovered objective ids",
      kind: "stringList",
    },
    { id: "coveragePercent", label: "Coverage percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      objectiveIds: value.objectiveIds as readonly string[],
      itemObjectiveIds: value.itemObjectiveIds as readonly string[],
      minimumItemsPerObjective: value.minimumItemsPerObjective as number,
    }),
});
export const run = tool.execute;
export default tool;
