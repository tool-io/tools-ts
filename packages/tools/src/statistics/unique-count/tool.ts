import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type UniqueCountInput = {
  readonly values: readonly number[];
};

export type UniqueCountOutput = {
  readonly unique: number;
};

export const calculateUniqueCount = (
  input: UniqueCountInput,
): UniqueCountOutput => ({ unique: new Set(input.values).size });

export const uniqueCountExample = {
  input: { values: [4, 4, 8, 12, 8] },
  output: { unique: 3 },
} satisfies ToolExample<UniqueCountInput, UniqueCountOutput>;

export const uniqueCountTool = createSimpleTool({
  id: "statistics/unique-count",
  title: "Unique Count Tool",
  description: "Count the distinct numeric values in a list.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "unique", label: "Unique count", kind: "integer" }],
  calculate: (input) => calculateUniqueCount(input as UniqueCountInput),
});
export const runUniqueCount = uniqueCountTool.execute;
export default uniqueCountTool;
