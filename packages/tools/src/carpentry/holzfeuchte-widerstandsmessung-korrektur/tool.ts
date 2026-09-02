import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  interpolate,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredLogResistanceKnots: readonly number[];
  readonly callerVerifiedMoisturePercentKnots: readonly number[];
  readonly observedElectricalResistanceOhms: number;
  readonly observedWoodTemperatureC: number;
  readonly callerCalibrationTemperatureC: number;
  readonly callerVerifiedTemperatureOffsetPointsPerC: number;
}>;
export type Output = Readonly<{
  readonly calibratedResistanceWoodMoisturePercent: number;
}>;
const inputFields = [
  {
    id: "callerMeasuredLogResistanceKnots",
    label: "Caller measured log resistance knots",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMoisturePercentKnots",
    label: "Caller verified moisture percent knots",
    kind: "numberList",
  },
  {
    id: "observedElectricalResistanceOhms",
    label: "Observed electrical resistance ohms",
    kind: "number",
  },
  {
    id: "observedWoodTemperatureC",
    label: "Observed wood temperature c",
    kind: "number",
  },
  {
    id: "callerCalibrationTemperatureC",
    label: "Caller calibration temperature c",
    kind: "number",
  },
  {
    id: "callerVerifiedTemperatureOffsetPointsPerC",
    label: "Caller verified temperature offset points per c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedElectricalResistanceOhms,
    "observedElectricalResistanceOhms",
  );
  input.callerVerifiedMoisturePercentKnots.forEach((v) =>
    nonnegative(v, "callerVerifiedMoisturePercentKnots"),
  );
  const value = interpolate(
    input.callerMeasuredLogResistanceKnots,
    input.callerVerifiedMoisturePercentKnots,
    Math.log(input.observedElectricalResistanceOhms),
  );
  return {
    calibratedResistanceWoodMoisturePercent:
      value +
      (input.observedWoodTemperatureC - input.callerCalibrationTemperatureC) *
        input.callerVerifiedTemperatureOffsetPointsPerC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMeasuredLogResistanceKnots: [0, 1, 2],
  callerVerifiedMoisturePercentKnots: [20, 15, 10],
  observedElectricalResistanceOhms: 2.718281828459045,
  observedWoodTemperatureC: 25,
  callerCalibrationTemperatureC: 20,
  callerVerifiedTemperatureOffsetPointsPerC: 0.1,
} satisfies Input;
export const exampleOutput = {
  calibratedResistanceWoodMoisturePercent: 15.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/holzfeuchte-widerstandsmessung-korrektur",
  title: "Holzfeuchte Widerstandsmessung Korrektur Calculator",
  description:
    "Interpret actual resistance OHMS via independently measured natural-log-resistance species calibration plus matched temperature correction, unlike existing already-converted moisture-percent species offset; no meter accuracy guarantee. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedResistanceWoodMoisturePercent",
      label: "Calibrated resistance wood moisture percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMeasuredLogResistanceKnots:
        value.callerMeasuredLogResistanceKnots as readonly number[],
      callerVerifiedMoisturePercentKnots:
        value.callerVerifiedMoisturePercentKnots as readonly number[],
      observedElectricalResistanceOhms:
        value.observedElectricalResistanceOhms as number,
      observedWoodTemperatureC: value.observedWoodTemperatureC as number,
      callerCalibrationTemperatureC:
        value.callerCalibrationTemperatureC as number,
      callerVerifiedTemperatureOffsetPointsPerC:
        value.callerVerifiedTemperatureOffsetPointsPerC as number,
    }),
});
export const run = tool.execute;
export default tool;
