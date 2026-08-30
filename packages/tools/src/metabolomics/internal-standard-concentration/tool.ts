import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly analytePeakArea: number;
  readonly internalStandardPeakArea: number;
  readonly internalStandardUmol: number;
  readonly responseFactor: number;
}>;
export type Output = Readonly<{
  readonly analyteConcentrationUmol: number;
  readonly areaRatio: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.analytePeakArea < 0 ||
    input.internalStandardPeakArea <= 0 ||
    input.internalStandardUmol <= 0 ||
    input.responseFactor <= 0
  )
    simpleError(
      "internalStandardPeakArea",
      "Positive internal standard and response factor required.",
    );
  const areaRatio = input.analytePeakArea / input.internalStandardPeakArea;
  return {
    analyteConcentrationUmol:
      (areaRatio * input.internalStandardUmol) / input.responseFactor,
    areaRatio,
  };
};
export const exampleInput = {
  analytePeakArea: 100,
  internalStandardPeakArea: 50,
  internalStandardUmol: 10,
  responseFactor: 2,
} satisfies Input;
export const exampleOutput = {
  analyteConcentrationUmol: 10,
  areaRatio: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/internal-standard-concentration",
  title: "Internal Standard Concentration",
  description:
    "Quantify analyte concentration from internal-standard area and caller-provided response factor.",
  inputs: [
    { id: "analytePeakArea", kind: "number", label: "Analyte peak area" },
    {
      id: "internalStandardPeakArea",
      kind: "number",
      label: "Internal standard peak area",
    },
    {
      id: "internalStandardUmol",
      kind: "number",
      label: "Internal standard umol",
    },
    { id: "responseFactor", kind: "number", label: "Response factor" },
  ],
  outputs: [
    {
      id: "analyteConcentrationUmol",
      kind: "number",
      label: "Analyte concentration umol",
    },
    { id: "areaRatio", kind: "number", label: "Area ratio" },
  ],
  calculate: (value) =>
    calculate({
      analytePeakArea: value.analytePeakArea as number,
      internalStandardPeakArea: value.internalStandardPeakArea as number,
      internalStandardUmol: value.internalStandardUmol as number,
      responseFactor: value.responseFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
