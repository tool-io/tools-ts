import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly sampleOd: number;
  readonly blankOd: number;
  readonly cutoffOd: number;
  readonly positiveIndexCutoff: number;
}>;
export type Output = Readonly<{
  readonly correctedOd: number;
  readonly cutoffIndex: number;
  readonly aboveCutoff: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.sampleOd, "sampleOd");
  nonnegative(input.blankOd, "blankOd");
  positive(input.positiveIndexCutoff, "positiveIndexCutoff");
  if (input.cutoffOd <= input.blankOd)
    simpleError("cutoffOd", "Assay cutoff must exceed its blank.");
  const correctedOd = Math.max(0, input.sampleOd - input.blankOd),
    cutoffIndex = correctedOd / (input.cutoffOd - input.blankOd);
  return {
    correctedOd,
    cutoffIndex,
    aboveCutoff: cutoffIndex >= input.positiveIndexCutoff,
  };
};
export const exampleInput = {
  sampleOd: 0.6,
  blankOd: 0.1,
  cutoffOd: 0.5,
  positiveIndexCutoff: 1,
} satisfies Input;
export const exampleOutput = {
  correctedOd: 0.5,
  cutoffIndex: 1.25,
  aboveCutoff: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/elisa-cutoff-index",
  title: "ELISA Cutoff Index",
  description:
    "Calculate a blank-corrected ELISA cutoff index using the supplied assay cutoff.",
  inputs: [
    { id: "sampleOd", label: "Sample od", kind: "number" },
    { id: "blankOd", label: "Blank od", kind: "number" },
    { id: "cutoffOd", label: "Cutoff od", kind: "number" },
    {
      id: "positiveIndexCutoff",
      label: "Positive index cutoff",
      kind: "number",
    },
  ],
  outputs: [
    { id: "correctedOd", label: "Corrected od", kind: "number" },
    { id: "cutoffIndex", label: "Cutoff index", kind: "number" },
    { id: "aboveCutoff", label: "Above cutoff", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sampleOd: value.sampleOd as number,
      blankOd: value.blankOd as number,
      cutoffOd: value.cutoffOd as number,
      positiveIndexCutoff: value.positiveIndexCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
