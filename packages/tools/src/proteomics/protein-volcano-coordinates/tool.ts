import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly log2FoldChanges: readonly number[];
  readonly adjustedPValues: readonly number[];
  readonly pValueFloor: number;
}>;
export type Output = Readonly<{
  readonly xCoordinates: readonly number[];
  readonly yCoordinates: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (
    input.log2FoldChanges.length !== input.adjustedPValues.length ||
    input.adjustedPValues.some((v) => v < 0 || v > 1) ||
    input.pValueFloor <= 0 ||
    input.pValueFloor > 1
  )
    simpleError(
      "adjustedPValues",
      "Aligned effects and p-values with positive floor required.",
    );
  return {
    xCoordinates: [...input.log2FoldChanges],
    yCoordinates: input.adjustedPValues.map(
      (v) => -Math.log10(Math.max(v, input.pValueFloor)),
    ),
  };
};
export const exampleInput = {
  log2FoldChanges: [1, -2],
  adjustedPValues: [0.01, 0.001],
  pValueFloor: 1e-6,
} satisfies Input;
export const exampleOutput = {
  xCoordinates: [1, -2],
  yCoordinates: [2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-volcano-coordinates",
  title: "Protein Volcano Coordinates",
  description:
    "Build protein volcano-plot log2 effect and negative-log10 FDR coordinates.",
  inputs: [
    { id: "log2FoldChanges", label: "Log 2 fold changes", kind: "numberList" },
    { id: "adjustedPValues", label: "Adjusted p values", kind: "numberList" },
    { id: "pValueFloor", label: "P value floor", kind: "number" },
  ],
  outputs: [
    { id: "xCoordinates", label: "X coordinates", kind: "numberList" },
    { id: "yCoordinates", label: "Y coordinates", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      log2FoldChanges: value.log2FoldChanges as readonly number[],
      adjustedPValues: value.adjustedPValues as readonly number[],
      pValueFloor: value.pValueFloor as number,
    }),
});
export const run = tool.execute;
export default tool;
