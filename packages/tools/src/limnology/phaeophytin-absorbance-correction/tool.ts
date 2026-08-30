import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly beforeAcidAbsorbance: number;
  readonly afterAcidAbsorbance: number;
  readonly blankAbsorbance: number;
  readonly acidificationRatio: number;
  readonly calibratedCoefficientMgPerLiter: number;
  readonly opticalPathCm: number;
  readonly extractWaterVolumeRatio: number;
}>;
export type Output = Readonly<{
  readonly correctedChlorophyllMicrogramsPerLiter: number;
  readonly phaeophytinMicrogramsPerLiter: number;
  readonly negativeEstimatePresent: boolean;
}>;
const inputFields = [
  {
    id: "beforeAcidAbsorbance",
    label: "Before acid absorbance",
    kind: "number",
  },
  { id: "afterAcidAbsorbance", label: "After acid absorbance", kind: "number" },
  { id: "blankAbsorbance", label: "Blank absorbance", kind: "number" },
  { id: "acidificationRatio", label: "Acidification ratio", kind: "number" },
  {
    id: "calibratedCoefficientMgPerLiter",
    label: "Calibrated coefficient mg per liter",
    kind: "number",
  },
  { id: "opticalPathCm", label: "Optical path cm", kind: "number" },
  {
    id: "extractWaterVolumeRatio",
    label: "Extract water volume ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.calibratedCoefficientMgPerLiter,
    "calibratedCoefficientMgPerLiter",
  );
  positive(input.opticalPathCm, "opticalPathCm");
  nonnegative(input.beforeAcidAbsorbance, "beforeAcidAbsorbance");
  nonnegative(input.afterAcidAbsorbance, "afterAcidAbsorbance");
  nonnegative(input.blankAbsorbance, "blankAbsorbance");
  nonnegative(input.extractWaterVolumeRatio, "extractWaterVolumeRatio");
  if (input.acidificationRatio <= 1)
    simpleError(
      "acidificationRatio",
      "Calibration acidification ratio above one required.",
    );
  const a = input.beforeAcidAbsorbance - input.blankAbsorbance,
    b = input.afterAcidAbsorbance - input.blankAbsorbance,
    k =
      (input.calibratedCoefficientMgPerLiter / input.opticalPathCm) *
      input.extractWaterVolumeRatio *
      1000,
    correctedChlorophyllMicrogramsPerLiter = k * (a - b),
    phaeophytinMicrogramsPerLiter = k * (input.acidificationRatio * b - a);
  return {
    correctedChlorophyllMicrogramsPerLiter,
    phaeophytinMicrogramsPerLiter,
    negativeEstimatePresent:
      correctedChlorophyllMicrogramsPerLiter < 0 ||
      phaeophytinMicrogramsPerLiter < 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  beforeAcidAbsorbance: 0.2,
  afterAcidAbsorbance: 0.1,
  blankAbsorbance: 0.01,
  acidificationRatio: 1.7,
  calibratedCoefficientMgPerLiter: 26.7,
  opticalPathCm: 1,
  extractWaterVolumeRatio: 0.01,
} satisfies Input;
export const exampleOutput = {
  correctedChlorophyllMicrogramsPerLiter: 26.7,
  phaeophytinMicrogramsPerLiter: -9.879,
  negativeEstimatePresent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/phaeophytin-absorbance-correction",
  title: "Phaeophytin Absorbance Correction",
  description:
    "Apply caller acid-correction convention Chl=k(Apre−Apost), phaeo=k(R·Apost−Apre); k must include method-specific acidification factors, and negative estimates are flagged rather than clamped.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedChlorophyllMicrogramsPerLiter",
      label: "Corrected chlorophyll micrograms per liter",
      kind: "number",
    },
    {
      id: "phaeophytinMicrogramsPerLiter",
      label: "Phaeophytin micrograms per liter",
      kind: "number",
    },
    {
      id: "negativeEstimatePresent",
      label: "Negative estimate present",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      beforeAcidAbsorbance: value.beforeAcidAbsorbance as number,
      afterAcidAbsorbance: value.afterAcidAbsorbance as number,
      blankAbsorbance: value.blankAbsorbance as number,
      acidificationRatio: value.acidificationRatio as number,
      calibratedCoefficientMgPerLiter:
        value.calibratedCoefficientMgPerLiter as number,
      opticalPathCm: value.opticalPathCm as number,
      extractWaterVolumeRatio: value.extractWaterVolumeRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
