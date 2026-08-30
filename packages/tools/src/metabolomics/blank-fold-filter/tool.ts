import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleAreas: readonly number[];
  readonly blankAreas: readonly number[];
  readonly minimumFold: number;
}>;
export type Output = Readonly<{
  readonly sampleBlankFolds: readonly number[];
  readonly retainedIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.sampleAreas.length;
  if (
    n === 0 ||
    input.blankAreas.length !== n ||
    input.blankAreas.some((v) => v <= 0) ||
    input.sampleAreas.some((v) => v < 0) ||
    input.minimumFold < 0
  )
    simpleError(
      "blankAreas",
      "Positive blank areas and aligned sample areas required.",
    );
  const sampleBlankFolds = input.sampleAreas.map(
    (v, i) => v / input.blankAreas[i],
  );
  return {
    sampleBlankFolds,
    retainedIndexes: sampleBlankFolds.flatMap((v, i) =>
      v >= input.minimumFold ? [i] : [],
    ),
  };
};
export const exampleInput = {
  sampleAreas: [10, 30, 5],
  blankAreas: [1, 10, 2],
  minimumFold: 5,
} satisfies Input;
export const exampleOutput = {
  sampleBlankFolds: [10, 3, 2.5],
  retainedIndexes: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/blank-fold-filter",
  title: "Blank Fold Filter",
  description: "Filter features by sample-to-blank peak-area ratio.",
  inputs: [
    { id: "sampleAreas", kind: "numberList", label: "Sample areas" },
    { id: "blankAreas", kind: "numberList", label: "Blank areas" },
    { id: "minimumFold", kind: "number", label: "Minimum fold" },
  ],
  outputs: [
    { id: "sampleBlankFolds", kind: "numberList", label: "Sample blank folds" },
    { id: "retainedIndexes", kind: "numberList", label: "Retained indexes" },
  ],
  calculate: (value) =>
    calculate({
      sampleAreas: value.sampleAreas as readonly number[],
      blankAreas: value.blankAreas as readonly number[],
      minimumFold: value.minimumFold as number,
    }),
});
export const run = tool.execute;
export default tool;
