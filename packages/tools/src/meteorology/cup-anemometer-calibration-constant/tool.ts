import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  regression,
  maximum,
  minimum,
} from "../shared.js";

export type Input = Readonly<{
  readonly observedCupRotationsPerSecond: readonly number[];
  readonly referenceWindSpeedsMPerSecond: readonly number[];
  readonly predictionRotationsPerSecond: number;
}>;
export type Output = Readonly<{
  readonly calibratedSpeedPerRotation: number;
  readonly calibratedWindOffsetMPerSecond: number;
  readonly predictedWindSpeedMPerSecond: number;
  readonly predictionOutsideCalibrationRange: boolean;
}>;
const inputFields = [
  {
    id: "observedCupRotationsPerSecond",
    label: "Observed cup rotations per second",
    kind: "numberList",
  },
  {
    id: "referenceWindSpeedsMPerSecond",
    label: "Reference wind speeds m per second",
    kind: "numberList",
  },
  {
    id: "predictionRotationsPerSecond",
    label: "Prediction rotations per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCupRotationsPerSecond.forEach((v) =>
    nonnegative(v, "observedCupRotationsPerSecond"),
  );
  input.referenceWindSpeedsMPerSecond.forEach((v) =>
    nonnegative(v, "referenceWindSpeedsMPerSecond"),
  );
  nonnegative(
    input.predictionRotationsPerSecond,
    "predictionRotationsPerSecond",
  );
  const fit = regression(
    input.observedCupRotationsPerSecond,
    input.referenceWindSpeedsMPerSecond,
  );
  positive(fit.slope, "calibrationSlope");
  return {
    calibratedSpeedPerRotation: fit.slope,
    calibratedWindOffsetMPerSecond: fit.intercept,
    predictedWindSpeedMPerSecond: nonnegative(
      fit.intercept + fit.slope * input.predictionRotationsPerSecond,
      "predictedWind",
    ),
    predictionOutsideCalibrationRange:
      input.predictionRotationsPerSecond <
        minimum(input.observedCupRotationsPerSecond) ||
      input.predictionRotationsPerSecond >
        maximum(input.observedCupRotationsPerSecond),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCupRotationsPerSecond: [1, 2, 3],
  referenceWindSpeedsMPerSecond: [3, 5, 7],
  predictionRotationsPerSecond: 4,
} satisfies Input;
export const exampleOutput = {
  calibratedSpeedPerRotation: 2,
  calibratedWindOffsetMPerSecond: 1,
  predictedWindSpeedMPerSecond: 9,
  predictionOutsideCalibrationRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/cup-anemometer-calibration-constant",
  title: "Cup Anemometer Calibration Constant",
  description:
    "Calibrate measured cup rotation rates to reference wind with explicit intercept/slope and extrapolation flag; not a universal instrument constant, gust response or certified sensor accuracy.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedSpeedPerRotation",
      label: "Calibrated speed per rotation",
      kind: "number",
    },
    {
      id: "calibratedWindOffsetMPerSecond",
      label: "Calibrated wind offset m per second",
      kind: "number",
    },
    {
      id: "predictedWindSpeedMPerSecond",
      label: "Predicted wind speed m per second",
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
      observedCupRotationsPerSecond:
        value.observedCupRotationsPerSecond as readonly number[],
      referenceWindSpeedsMPerSecond:
        value.referenceWindSpeedsMPerSecond as readonly number[],
      predictionRotationsPerSecond:
        value.predictionRotationsPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
