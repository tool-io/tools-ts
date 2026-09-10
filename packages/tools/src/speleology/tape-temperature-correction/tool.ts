import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualRecordedTapeLengthMeters: number;
  readonly callerVerifiedTapeExpansionPerKelvin: number;
  readonly actualTapeTemperatureKelvin: number;
  readonly callerTapeCalibrationTemperatureKelvin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedTapeLengthMeters",
    label: "Actual recorded tape length meters",
    kind: "number",
  },
  {
    id: "callerVerifiedTapeExpansionPerKelvin",
    label: "Caller verified tape expansion per kelvin",
    kind: "number",
  },
  {
    id: "actualTapeTemperatureKelvin",
    label: "Actual tape temperature kelvin",
    kind: "number",
  },
  {
    id: "callerTapeCalibrationTemperatureKelvin",
    label: "Caller tape calibration temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualRecordedTapeLengthMeters, "length");
  nonnegative(input.callerVerifiedTapeExpansionPerKelvin, "alpha");
  positive(input.actualTapeTemperatureKelvin, "kelvin");
  positive(input.callerTapeCalibrationTemperatureKelvin, "calibrationkelvin");
  const c =
    input.actualRecordedTapeLengthMeters *
    input.callerVerifiedTapeExpansionPerKelvin *
    (input.actualTapeTemperatureKelvin -
      input.callerTapeCalibrationTemperatureKelvin);
  if (input.actualRecordedTapeLengthMeters + c < 0)
    simpleError("correction", "Nonnegative correctedlength.");
  return {
    conditionalTemperatureCorrectedDistanceMeters:
      input.actualRecordedTapeLengthMeters + c,
    signedTemperatureCorrectionMeters: c,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedTapeLengthMeters: 10,
    callerVerifiedTapeExpansionPerKelvin: 0.001,
    actualTapeTemperatureKelvin: 310,
    callerTapeCalibrationTemperatureKelvin: 300,
  },
  output: {
    result: {
      conditionalTemperatureCorrectedDistanceMeters: 10.1,
      signedTemperatureCorrectionMeters: 0.1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/tape-temperature-correction",
  title: "Tape Distance Temperature Correction Calculator",
  description:
    "Linear tape thermal expansion Lcorrected=Lrecorded[1+\u03b1(T\u2212Tcal)]under actual tape-material calibration. No tension, sag, humidity correction or precision claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
