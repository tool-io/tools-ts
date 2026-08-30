import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly activityIds: readonly string[];
  readonly gridWidth: number;
}>;
export type Output = Readonly<{
  readonly rows: readonly string[];
  readonly diagonalChoices: readonly string[];
  readonly filledCells: number;
}>;
export const calculate = (input: Input): Output => {
  const { activityIds, gridWidth } = input;
  if (
    !Number.isSafeInteger(gridWidth) ||
    gridWidth < 2 ||
    activityIds.length !== gridWidth ** 2 ||
    new Set(activityIds).size !== activityIds.length ||
    activityIds.some((v) => v.includes("|") || v.includes(","))
  )
    simpleError(
      "activityIds",
      "Exactly width-squared distinct activities without separators required.",
    );
  const rows = Array.from({ length: gridWidth }, (_, i) =>
    activityIds.slice(i * gridWidth, (i + 1) * gridWidth).join("|"),
  );
  return {
    rows,
    diagonalChoices: [
      Array.from(
        { length: gridWidth },
        (_, i) => activityIds[i * gridWidth + i],
      ).join(","),
      Array.from(
        { length: gridWidth },
        (_, i) => activityIds[i * gridWidth + gridWidth - 1 - i],
      ).join(","),
    ],
    filledCells: activityIds.length,
  };
};
export const exampleInput = {
  activityIds: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
  gridWidth: 3,
} satisfies Input;
export const exampleOutput = {
  rows: ["A|B|C", "D|E|F", "G|H|I"],
  diagonalChoices: ["A,E,I", "C,E,G"],
  filledCells: 9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/choice-board-grid",
  title: "Choice Board Grid",
  description:
    "Arrange distinct activities in a square choice board with diagonal paths.",
  inputs: [
    { id: "activityIds", label: "Activity ids", kind: "stringList" },
    { id: "gridWidth", label: "Grid width", kind: "number" },
  ],
  outputs: [
    { id: "rows", label: "Rows", kind: "stringList" },
    { id: "diagonalChoices", label: "Diagonal choices", kind: "stringList" },
    { id: "filledCells", label: "Filled cells", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      activityIds: value.activityIds as readonly string[],
      gridWidth: value.gridWidth as number,
    }),
});
export const run = tool.execute;
export default tool;
