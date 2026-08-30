import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mitochondrialMappedReads: number;
  readonly allMappedReads: number;
  readonly maximumMitoPercent: number;
}>;
export type Output = Readonly<{
  readonly mitoPercent: number;
  readonly nuclearAndOtherReads: number;
  readonly contaminationFlag: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.allMappedReads <= 0 ||
    input.mitochondrialMappedReads < 0 ||
    input.mitochondrialMappedReads > input.allMappedReads
  )
    simpleError("allMappedReads", "Valid positive mapped-read total required.");
  const mitoPercent =
    (input.mitochondrialMappedReads / input.allMappedReads) * 100;
  return {
    mitoPercent,
    nuclearAndOtherReads: input.allMappedReads - input.mitochondrialMappedReads,
    contaminationFlag: mitoPercent > input.maximumMitoPercent,
  };
};

export const exampleInput = {
  mitochondrialMappedReads: 10,
  allMappedReads: 100,
  maximumMitoPercent: 15,
} satisfies Input;
export const exampleOutput = {
  mitoPercent: 10,
  nuclearAndOtherReads: 90,
  contaminationFlag: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/library-mito-fraction",
  title: "Library Mito Fraction",
  description:
    "Screen a bulk RNA library for elevated mitochondrial-read fraction.",
  inputs: [
    {
      id: "mitochondrialMappedReads",
      kind: "number",
      label: "Mitochondrial mapped reads",
    },
    { id: "allMappedReads", kind: "number", label: "All mapped reads" },
    {
      id: "maximumMitoPercent",
      kind: "number",
      label: "Maximum mito percent",
    },
  ],
  outputs: [
    { id: "mitoPercent", kind: "number", label: "Mito percent" },
    {
      id: "nuclearAndOtherReads",
      kind: "number",
      label: "Nuclear and other reads",
    },
    { id: "contaminationFlag", kind: "boolean", label: "Contamination flag" },
  ],
  calculate: (value) =>
    calculate({
      mitochondrialMappedReads: value.mitochondrialMappedReads as number,
      allMappedReads: value.allMappedReads as number,
      maximumMitoPercent: value.maximumMitoPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
