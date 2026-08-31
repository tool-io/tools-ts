import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  interpolate,
  monotone,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly calibrationVoltagesV: readonly number[];
  readonly calibrationDistancesCm: readonly number[];
  readonly observedVoltageV: number;
}>;
export type Output = Readonly<{ readonly withinCalibrationDistanceCm: number }>;
const inputFields = [
  {
    id: "calibrationVoltagesV",
    label: "Calibration voltages v",
    kind: "numberList",
  },
  {
    id: "calibrationDistancesCm",
    label: "Calibration distances cm",
    kind: "numberList",
  },
  { id: "observedVoltageV", label: "Observed voltage v", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.calibrationDistancesCm.forEach((v) =>
    positive(v, "calibrationDistancesCm"),
  );
  aligned(
    input.calibrationVoltagesV,
    input.calibrationDistancesCm,
    "calibrationVoltagesV",
  );
  monotone(input.calibrationDistancesCm, "down", "distance");
  return {
    withinCalibrationDistanceCm: interpolate(
      input.calibrationVoltagesV,
      input.calibrationDistancesCm,
      input.observedVoltageV,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calibrationVoltagesV: [1, 2, 3],
  calibrationDistancesCm: [30, 15, 10],
  observedVoltageV: 1.5,
} satisfies Input;
export const exampleOutput = {
  withinCalibrationDistanceCm: 22.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/infrared-distance-from-voltage",
  title: "Infrared Distance From Voltage Calculator",
  description:
    "Interpolate observed infrared sensor voltage on explicit monotone caller branch only; near/far ambiguity, target reflectivity and uncalibrated extrapolation are not guessed.",
  inputs: inputFields,
  outputs: [
    {
      id: "withinCalibrationDistanceCm",
      label: "Within calibration distance cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      calibrationVoltagesV: value.calibrationVoltagesV as readonly number[],
      calibrationDistancesCm: value.calibrationDistancesCm as readonly number[],
      observedVoltageV: value.observedVoltageV as number,
    }),
});
export const run = tool.execute;
export default tool;
