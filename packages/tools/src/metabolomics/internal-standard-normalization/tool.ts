import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly analytePeakAreas: readonly number[];
  readonly internalStandardAreas: readonly number[];
  readonly internalStandardConcentration: number;
}>;
export type Output = Readonly<{
  readonly areaRatios: readonly number[];
  readonly normalizedConcentrations: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.analytePeakAreas.length;
  if (
    n === 0 ||
    input.internalStandardAreas.length !== n ||
    input.internalStandardAreas.some((v) => v <= 0) ||
    input.internalStandardConcentration <= 0
  )
    simpleError(
      "internalStandardAreas",
      "Aligned positive internal-standard areas required.",
    );
  const areaRatios = input.analytePeakAreas.map(
    (v, i) => v / input.internalStandardAreas[i],
  );
  return {
    areaRatios,
    normalizedConcentrations: areaRatios.map(
      (v) => v * input.internalStandardConcentration,
    ),
  };
};
export const exampleInput = {
  analytePeakAreas: [10, 20],
  internalStandardAreas: [2, 4],
  internalStandardConcentration: 5,
} satisfies Input;
export const exampleOutput = {
  areaRatios: [5, 5],
  normalizedConcentrations: [25, 25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/internal-standard-normalization",
  title: "Internal Standard Normalization",
  description:
    "Normalize analyte peak areas against matched internal-standard injections.",
  inputs: [
    { id: "analytePeakAreas", kind: "numberList", label: "Analyte peak areas" },
    {
      id: "internalStandardAreas",
      kind: "numberList",
      label: "Internal standard areas",
    },
    {
      id: "internalStandardConcentration",
      kind: "number",
      label: "Internal standard concentration",
    },
  ],
  outputs: [
    { id: "areaRatios", kind: "numberList", label: "Area ratios" },
    {
      id: "normalizedConcentrations",
      kind: "numberList",
      label: "Normalized concentrations",
    },
  ],
  calculate: (value) =>
    calculate({
      analytePeakAreas: value.analytePeakAreas as readonly number[],
      internalStandardAreas: value.internalStandardAreas as readonly number[],
      internalStandardConcentration:
        value.internalStandardConcentration as number,
    }),
});
export const run = tool.execute;
export default tool;
