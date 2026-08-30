import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly targetCts: readonly number[];
  readonly referenceCts: readonly number[];
}>;
export type Output = Readonly<{
  readonly referenceMeanCt: number;
  readonly normalizedDeltaCts: readonly number[];
  readonly meanDeltaCt: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.targetCts.length === 0 || input.referenceCts.length === 0)
    simpleError(
      "targetCts",
      "Nonempty target and reference Ct values are required.",
    );
  const referenceMeanCt =
      input.referenceCts.reduce((a, b) => a + b, 0) / input.referenceCts.length,
    normalizedDeltaCts = input.targetCts.map((v) => v - referenceMeanCt);
  return {
    referenceMeanCt,
    normalizedDeltaCts,
    meanDeltaCt:
      normalizedDeltaCts.reduce((a, b) => a + b, 0) / normalizedDeltaCts.length,
  };
};

export const exampleInput = {
  targetCts: [25, 27],
  referenceCts: [20, 22],
} satisfies Input;
export const exampleOutput = {
  referenceMeanCt: 21,
  normalizedDeltaCts: [4, 6],
  meanDeltaCt: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/global-mean-delta-ct",
  title: "Global Mean Delta CT",
  description: "Normalize target Ct values to a reference-gene global mean.",
  inputs: [
    { id: "targetCts", kind: "numberList", label: "Target cts" },
    { id: "referenceCts", kind: "numberList", label: "Reference cts" },
  ],
  outputs: [
    { id: "referenceMeanCt", kind: "number", label: "Reference mean ct" },
    {
      id: "normalizedDeltaCts",
      kind: "numberList",
      label: "Normalized delta cts",
    },
    { id: "meanDeltaCt", kind: "number", label: "Mean delta ct" },
  ],
  calculate: (value) =>
    calculate({
      targetCts: value.targetCts as readonly number[],
      referenceCts: value.referenceCts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
