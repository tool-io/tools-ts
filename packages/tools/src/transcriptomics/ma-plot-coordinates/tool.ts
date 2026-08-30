import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly treatmentCounts: readonly number[];
  readonly controlCounts: readonly number[];
  readonly pseudocount: number;
}>;
export type Output = Readonly<{
  readonly mCoordinates: readonly number[];
  readonly aCoordinates: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  if (
    input.treatmentCounts.length === 0 ||
    input.treatmentCounts.length !== input.controlCounts.length ||
    input.pseudocount < 0 ||
    input.treatmentCounts.some(
      (v, i) =>
        v + input.pseudocount <= 0 ||
        input.controlCounts[i] + input.pseudocount <= 0,
    )
  )
    simpleError(
      "treatmentCounts",
      "Aligned positive adjusted counts are required.",
    );
  const mCoordinates = input.treatmentCounts.map((v, i) =>
      Math.log2(
        (v + input.pseudocount) / (input.controlCounts[i] + input.pseudocount),
      ),
    ),
    aCoordinates = input.treatmentCounts.map(
      (v, i) =>
        (Math.log2(v + input.pseudocount) +
          Math.log2(input.controlCounts[i] + input.pseudocount)) /
        2,
    );
  return { mCoordinates, aCoordinates };
};

export const exampleInput = {
  treatmentCounts: [8, 2],
  controlCounts: [2, 8],
  pseudocount: 0,
} satisfies Input;
export const exampleOutput = {
  mCoordinates: [2, -2],
  aCoordinates: [2, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/ma-plot-coordinates",
  title: "Ma Plot Coordinates",
  description: "Generate MA-plot log-ratio and mean-abundance coordinates.",
  inputs: [
    { id: "treatmentCounts", kind: "numberList", label: "Treatment counts" },
    { id: "controlCounts", kind: "numberList", label: "Control counts" },
    { id: "pseudocount", kind: "number", label: "Pseudocount" },
  ],
  outputs: [
    { id: "mCoordinates", kind: "numberList", label: "M coordinates" },
    { id: "aCoordinates", kind: "numberList", label: "A coordinates" },
  ],
  calculate: (value) =>
    calculate({
      treatmentCounts: value.treatmentCounts as readonly number[],
      controlCounts: value.controlCounts as readonly number[],
      pseudocount: value.pseudocount as number,
    }),
});
export const run = tool.execute;
export default tool;
