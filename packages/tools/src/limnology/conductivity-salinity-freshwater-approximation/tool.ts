import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedConductivityMicroS: number;
  readonly observedTemperatureC: number;
  readonly referenceTemperatureC: number;
  readonly callerTempCoefficientPerC: number;
  readonly callerSalinityGkgPerReferenceMicroS: number;
  readonly callerCalibrationMaximumReferenceMicroS: number;
}>;
export type Output = Readonly<{
  readonly referenceNormalizedConductivityMicroS: number;
  readonly calibratedFreshwaterSalinityGkg: number;
}>;
const inputFields = [
  {
    id: "observedConductivityMicroS",
    label: "Observed conductivity micro s",
    kind: "number",
  },
  {
    id: "observedTemperatureC",
    label: "Observed temperature c",
    kind: "number",
  },
  {
    id: "referenceTemperatureC",
    label: "Reference temperature c",
    kind: "number",
  },
  {
    id: "callerTempCoefficientPerC",
    label: "Caller temp coefficient per c",
    kind: "number",
  },
  {
    id: "callerSalinityGkgPerReferenceMicroS",
    label: "Caller salinity gkg per reference micro s",
    kind: "number",
  },
  {
    id: "callerCalibrationMaximumReferenceMicroS",
    label: "Caller calibration maximum reference micro s",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerSalinityGkgPerReferenceMicroS,
    "callerSalinityGkgPerReferenceMicroS",
  );
  positive(
    input.callerCalibrationMaximumReferenceMicroS,
    "callerCalibrationMaximumReferenceMicroS",
  );
  nonnegative(input.observedConductivityMicroS, "observedConductivityMicroS");
  nonnegative(input.callerTempCoefficientPerC, "callerTempCoefficientPerC");
  const factor = positive(
      1 +
        input.callerTempCoefficientPerC *
          (input.observedTemperatureC - input.referenceTemperatureC),
      "temperatureFactor",
    ),
    ec = input.observedConductivityMicroS / factor;
  if (ec > input.callerCalibrationMaximumReferenceMicroS)
    simpleError(
      "calibration",
      "Normalized conductivity exceeds supplied freshwater calibration.",
    );
  return {
    referenceNormalizedConductivityMicroS: ec,
    calibratedFreshwaterSalinityGkg:
      ec * input.callerSalinityGkgPerReferenceMicroS,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConductivityMicroS: 100,
  observedTemperatureC: 20,
  referenceTemperatureC: 25,
  callerTempCoefficientPerC: 0.02,
  callerSalinityGkgPerReferenceMicroS: 0.001,
  callerCalibrationMaximumReferenceMicroS: 1000,
} satisfies Input;
export const exampleOutput = {
  referenceNormalizedConductivityMicroS: 111.11111111111111,
  calibratedFreshwaterSalinityGkg: 0.1111111111111111,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/conductivity-salinity-freshwater-approximation",
  title: "Conductivity Salinity Freshwater Approximation Converter",
  description:
    "Use explicit local freshwater conductivity/salinity calibration after caller linear temperature normalization; not universal seawater practical salinity, ionic composition inference or chemistry certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceNormalizedConductivityMicroS",
      label: "Reference normalized conductivity micro s",
      kind: "number",
    },
    {
      id: "calibratedFreshwaterSalinityGkg",
      label: "Calibrated freshwater salinity gkg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConductivityMicroS: value.observedConductivityMicroS as number,
      observedTemperatureC: value.observedTemperatureC as number,
      referenceTemperatureC: value.referenceTemperatureC as number,
      callerTempCoefficientPerC: value.callerTempCoefficientPerC as number,
      callerSalinityGkgPerReferenceMicroS:
        value.callerSalinityGkgPerReferenceMicroS as number,
      callerCalibrationMaximumReferenceMicroS:
        value.callerCalibrationMaximumReferenceMicroS as number,
    }),
});
export const run = tool.execute;
export default tool;
