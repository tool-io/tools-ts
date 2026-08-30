import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  regression,
  maximum,
  minimum,
} from "../shared.js";

export type Input = Readonly<{
  readonly observedSunshineFractions: readonly number[];
  readonly observedSolarEnergyFractions: readonly number[];
  readonly predictionSunshineFraction: number;
}>;
export type Output = Readonly<{
  readonly angstromPrescottA: number;
  readonly angstromPrescottB: number;
  readonly predictedSolarEnergyFraction: number;
  readonly predictionOutsideCalibrationRange: boolean;
}>;
const inputFields = [
  {
    id: "observedSunshineFractions",
    label: "Observed sunshine fractions",
    kind: "numberList",
  },
  {
    id: "observedSolarEnergyFractions",
    label: "Observed solar energy fractions",
    kind: "numberList",
  },
  {
    id: "predictionSunshineFraction",
    label: "Prediction sunshine fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSunshineFractions.forEach((v) =>
    fraction(v, "observedSunshineFractions"),
  );
  input.observedSolarEnergyFractions.forEach((v) =>
    fraction(v, "observedSolarEnergyFractions"),
  );
  fraction(input.predictionSunshineFraction, "predictionSunshineFraction");
  const fit = regression(
      input.observedSunshineFractions,
      input.observedSolarEnergyFractions,
    ),
    predictedSolarEnergyFraction = fraction(
      fit.intercept + fit.slope * input.predictionSunshineFraction,
      "predictedFraction",
    );
  return {
    angstromPrescottA: fit.intercept,
    angstromPrescottB: fit.slope,
    predictedSolarEnergyFraction,
    predictionOutsideCalibrationRange:
      input.predictionSunshineFraction <
        minimum(input.observedSunshineFractions) ||
      input.predictionSunshineFraction >
        maximum(input.observedSunshineFractions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSunshineFractions: [0, 1],
  observedSolarEnergyFractions: [0.2, 0.7],
  predictionSunshineFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  angstromPrescottA: 0.2,
  angstromPrescottB: 0.5,
  predictedSolarEnergyFraction: 0.45,
  predictionOutsideCalibrationRange: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/angstrom-prescott-coefficients",
  title: "Angstrom-Prescott A-B Coefficient Solver",
  description:
    "Fit measured Angstrom–Prescott sunshine/solar fraction coefficients and predict supplied sunshine fraction, exposing calibration-range extrapolation; no universal local coefficients or sunshine forecast.",
  inputs: inputFields,
  outputs: [
    { id: "angstromPrescottA", label: "Angstrom prescott a", kind: "number" },
    { id: "angstromPrescottB", label: "Angstrom prescott b", kind: "number" },
    {
      id: "predictedSolarEnergyFraction",
      label: "Predicted solar energy fraction",
      kind: "number",
    },
    {
      id: "predictionOutsideCalibrationRange",
      label: "Prediction outside calibration range",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSunshineFractions:
        value.observedSunshineFractions as readonly number[],
      observedSolarEnergyFractions:
        value.observedSolarEnergyFractions as readonly number[],
      predictionSunshineFraction: value.predictionSunshineFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
