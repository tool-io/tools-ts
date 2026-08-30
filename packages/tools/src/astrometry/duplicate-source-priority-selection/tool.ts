import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly sourceIds: readonly string[];
  readonly priorityRanks: readonly number[];
  readonly positionErrors: readonly number[];
}>;
export type Output = Readonly<{
  readonly selectedIndexes: readonly number[];
  readonly discardedIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.sourceIds, input.priorityRanks, "sourceIds");
  aligned(input.sourceIds, input.positionErrors, "sourceIds");
  input.priorityRanks.forEach((v) => count(v, "priorityRanks"));
  input.positionErrors.forEach((v) => positive(v, "positionErrors"));
  if (input.sourceIds.some((v) => !v.trim()))
    simpleError("sourceIds", "Nonempty duplicate-group IDs required.");
  const best = new Map<string, number>();
  input.sourceIds.forEach((id, i) => {
    const old = best.get(id);
    if (
      old === undefined ||
      input.priorityRanks[i] < input.priorityRanks[old] ||
      (input.priorityRanks[i] === input.priorityRanks[old] &&
        input.positionErrors[i] < input.positionErrors[old])
    )
      best.set(id, i);
  });
  const selectedIndexes = [...best.values()].sort((a, b) => a - b),
    selected = new Set(selectedIndexes);
  return {
    selectedIndexes,
    discardedIndexes: input.sourceIds.flatMap((_, i) =>
      selected.has(i) ? [] : [i],
    ),
  };
};
export const exampleInput = {
  sourceIds: ["A", "A", "B"],
  priorityRanks: [2, 1, 1],
  positionErrors: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  selectedIndexes: [1, 2],
  discardedIndexes: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/duplicate-source-priority-selection",
  title: "Duplicate Source Priority Selection",
  description:
    "Resolve explicitly grouped duplicate sources by lowest priority rank, then position error, then original order; identity grouping must be supplied.",
  inputs: [
    { id: "sourceIds", label: "Source ids", kind: "stringList" },
    { id: "priorityRanks", label: "Priority ranks", kind: "numberList" },
    { id: "positionErrors", label: "Position errors", kind: "numberList" },
  ],
  outputs: [
    { id: "selectedIndexes", label: "Selected indexes", kind: "numberList" },
    { id: "discardedIndexes", label: "Discarded indexes", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      sourceIds: value.sourceIds as readonly string[],
      priorityRanks: value.priorityRanks as readonly number[],
      positionErrors: value.positionErrors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
