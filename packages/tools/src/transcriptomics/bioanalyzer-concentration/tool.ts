import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly samplePeakArea: number;
  readonly ladderPeakArea: number;
  readonly ladderConcentrationNgUl: number;
}>;
export type Output = Readonly<{
  readonly concentrationNgUl: number;
  readonly areaRatio: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.ladderPeakArea <= 0 ||
    input.samplePeakArea < 0 ||
    input.ladderConcentrationNgUl <= 0
  )
    simpleError(
      "ladderPeakArea",
      "Positive ladder reference and nonnegative sample area required.",
    );
  const areaRatio = input.samplePeakArea / input.ladderPeakArea;
  return {
    concentrationNgUl: areaRatio * input.ladderConcentrationNgUl,
    areaRatio,
  };
};

export const exampleInput = {
  samplePeakArea: 150,
  ladderPeakArea: 100,
  ladderConcentrationNgUl: 20,
} satisfies Input;
export const exampleOutput = {
  concentrationNgUl: 30,
  areaRatio: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/bioanalyzer-concentration",
  title: "Bioanalyzer Concentration",
  description:
    "Interpolate sample concentration from a caller-supplied Bioanalyzer ladder peak.",
  inputs: [
    { id: "samplePeakArea", kind: "number", label: "Sample peak area" },
    { id: "ladderPeakArea", kind: "number", label: "Ladder peak area" },
    {
      id: "ladderConcentrationNgUl",
      kind: "number",
      label: "Ladder concentration ng ul",
    },
  ],
  outputs: [
    { id: "concentrationNgUl", kind: "number", label: "Concentration ng ul" },
    { id: "areaRatio", kind: "number", label: "Area ratio" },
  ],
  calculate: (value) =>
    calculate({
      samplePeakArea: value.samplePeakArea as number,
      ladderPeakArea: value.ladderPeakArea as number,
      ladderConcentrationNgUl: value.ladderConcentrationNgUl as number,
    }),
});
export const run = tool.execute;
export default tool;
