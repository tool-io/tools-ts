import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly cropNitrogenUptakeTargetKgPerHa: number;
  readonly soilAvailableNitrogenKgPerHa: number;
  readonly otherNitrogenCreditKgPerHa: number;
  readonly fertilizerRecoveryFraction: number;
  readonly fertilizerNitrogenMassFraction: number;
}>;
export type Output = Readonly<{
  readonly uncoveredCropNitrogenDemandKgPerHa: number;
  readonly modelFertilizerNitrogenKgPerHa: number;
  readonly modelFertilizerProductKgPerHa: number;
}>;
const inputFields = [
  {
    id: "cropNitrogenUptakeTargetKgPerHa",
    label: "Crop nitrogen uptake target kg per ha",
    kind: "number",
  },
  {
    id: "soilAvailableNitrogenKgPerHa",
    label: "Soil available nitrogen kg per ha",
    kind: "number",
  },
  {
    id: "otherNitrogenCreditKgPerHa",
    label: "Other nitrogen credit kg per ha",
    kind: "number",
  },
  {
    id: "fertilizerRecoveryFraction",
    label: "Fertilizer recovery fraction",
    kind: "number",
  },
  {
    id: "fertilizerNitrogenMassFraction",
    label: "Fertilizer nitrogen mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fertilizerRecoveryFraction, "fertilizerRecoveryFraction");
  positive(
    input.fertilizerNitrogenMassFraction,
    "fertilizerNitrogenMassFraction",
  );
  nonnegative(
    input.cropNitrogenUptakeTargetKgPerHa,
    "cropNitrogenUptakeTargetKgPerHa",
  );
  nonnegative(
    input.soilAvailableNitrogenKgPerHa,
    "soilAvailableNitrogenKgPerHa",
  );
  nonnegative(input.otherNitrogenCreditKgPerHa, "otherNitrogenCreditKgPerHa");
  fraction(input.fertilizerRecoveryFraction, "fertilizerRecoveryFraction");
  fraction(
    input.fertilizerNitrogenMassFraction,
    "fertilizerNitrogenMassFraction",
  );
  const uncoveredCropNitrogenDemandKgPerHa = Math.max(
      0,
      input.cropNitrogenUptakeTargetKgPerHa -
        input.soilAvailableNitrogenKgPerHa -
        input.otherNitrogenCreditKgPerHa,
    ),
    modelFertilizerNitrogenKgPerHa =
      uncoveredCropNitrogenDemandKgPerHa / input.fertilizerRecoveryFraction;
  return {
    uncoveredCropNitrogenDemandKgPerHa,
    modelFertilizerNitrogenKgPerHa,
    modelFertilizerProductKgPerHa:
      modelFertilizerNitrogenKgPerHa / input.fertilizerNitrogenMassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cropNitrogenUptakeTargetKgPerHa: 100,
  soilAvailableNitrogenKgPerHa: 30,
  otherNitrogenCreditKgPerHa: 20,
  fertilizerRecoveryFraction: 0.5,
  fertilizerNitrogenMassFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  uncoveredCropNitrogenDemandKgPerHa: 50,
  modelFertilizerNitrogenKgPerHa: 100,
  modelFertilizerProductKgPerHa: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/fertilizer-requirement-nitrogen",
  title: "Agriculture Fertilizer Requirement Nitrogen",
  description:
    "Balance caller crop N uptake/available soil/other credits with explicit recovery/product fractions; a simple accounting scenario, not agronomic sufficiency, environmental permission or application recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "uncoveredCropNitrogenDemandKgPerHa",
      label: "Uncovered crop nitrogen demand kg per ha",
      kind: "number",
    },
    {
      id: "modelFertilizerNitrogenKgPerHa",
      label: "Model fertilizer nitrogen kg per ha",
      kind: "number",
    },
    {
      id: "modelFertilizerProductKgPerHa",
      label: "Model fertilizer product kg per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cropNitrogenUptakeTargetKgPerHa:
        value.cropNitrogenUptakeTargetKgPerHa as number,
      soilAvailableNitrogenKgPerHa:
        value.soilAvailableNitrogenKgPerHa as number,
      otherNitrogenCreditKgPerHa: value.otherNitrogenCreditKgPerHa as number,
      fertilizerRecoveryFraction: value.fertilizerRecoveryFraction as number,
      fertilizerNitrogenMassFraction:
        value.fertilizerNitrogenMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
