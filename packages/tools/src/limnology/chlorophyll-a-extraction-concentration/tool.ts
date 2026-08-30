import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly spectralAbsorbances: readonly number[];
  readonly blankAbsorbances: readonly number[];
  readonly calibratedCoefficientsMgPerLiter: readonly number[];
  readonly opticalPathCm: number;
  readonly extractVolumeMl: number;
  readonly filteredWaterVolumeMl: number;
  readonly dilutionFactor: number;
}>;
export type Output = Readonly<{
  readonly extractChlorophyllMgPerLiter: number;
  readonly waterChlorophyllMicrogramsPerLiter: number;
}>;
const inputFields = [
  {
    id: "spectralAbsorbances",
    label: "Spectral absorbances",
    kind: "numberList",
  },
  { id: "blankAbsorbances", label: "Blank absorbances", kind: "numberList" },
  {
    id: "calibratedCoefficientsMgPerLiter",
    label: "Calibrated coefficients mg per liter",
    kind: "numberList",
  },
  { id: "opticalPathCm", label: "Optical path cm", kind: "number" },
  { id: "extractVolumeMl", label: "Extract volume ml", kind: "number" },
  {
    id: "filteredWaterVolumeMl",
    label: "Filtered water volume ml",
    kind: "number",
  },
  { id: "dilutionFactor", label: "Dilution factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.opticalPathCm, "opticalPathCm");
  positive(input.extractVolumeMl, "extractVolumeMl");
  positive(input.filteredWaterVolumeMl, "filteredWaterVolumeMl");
  positive(input.dilutionFactor, "dilutionFactor");
  input.spectralAbsorbances.forEach((v) =>
    nonnegative(v, "spectralAbsorbances"),
  );
  input.blankAbsorbances.forEach((v) => nonnegative(v, "blankAbsorbances"));
  aligned(
    input.spectralAbsorbances,
    input.blankAbsorbances,
    "spectralAbsorbances",
  );
  aligned(
    input.spectralAbsorbances,
    input.calibratedCoefficientsMgPerLiter,
    "spectralAbsorbances",
  );
  const extractChlorophyllMgPerLiter =
    (input.spectralAbsorbances.reduce(
      (s, v, i) =>
        s +
        (v - input.blankAbsorbances[i]) *
          input.calibratedCoefficientsMgPerLiter[i],
      0,
    ) /
      input.opticalPathCm) *
    input.dilutionFactor;
  return {
    extractChlorophyllMgPerLiter,
    waterChlorophyllMicrogramsPerLiter:
      (1000 * extractChlorophyllMgPerLiter * input.extractVolumeMl) /
      input.filteredWaterVolumeMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spectralAbsorbances: [0.2, 0.1, 0.1],
  blankAbsorbances: [0.01, 0.01, 0.01],
  calibratedCoefficientsMgPerLiter: [10, -2, -1],
  opticalPathCm: 1,
  extractVolumeMl: 10,
  filteredWaterVolumeMl: 1000,
  dilutionFactor: 1,
} satisfies Input;
export const exampleOutput = {
  extractChlorophyllMgPerLiter: 1.63,
  waterChlorophyllMicrogramsPerLiter: 16.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/chlorophyll-a-extraction-concentration",
  title: "Chlorophyll A Extraction Concentration",
  description:
    "Convert blank-corrected multiwavelength extract absorbances with caller method coefficients and path/dilution/sample-volume correction; negative estimates are retained and solvent-specific calibration is external.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractChlorophyllMgPerLiter",
      label: "Extract chlorophyll mg per liter",
      kind: "number",
    },
    {
      id: "waterChlorophyllMicrogramsPerLiter",
      label: "Water chlorophyll micrograms per liter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spectralAbsorbances: value.spectralAbsorbances as readonly number[],
      blankAbsorbances: value.blankAbsorbances as readonly number[],
      calibratedCoefficientsMgPerLiter:
        value.calibratedCoefficientsMgPerLiter as readonly number[],
      opticalPathCm: value.opticalPathCm as number,
      extractVolumeMl: value.extractVolumeMl as number,
      filteredWaterVolumeMl: value.filteredWaterVolumeMl as number,
      dilutionFactor: value.dilutionFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
