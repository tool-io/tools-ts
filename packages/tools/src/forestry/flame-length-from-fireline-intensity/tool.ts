import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly firelineIntensityKwPerM: number;
  readonly calibratedFlameLengthCoefficient: number;
  readonly calibratedPowerExponent: number;
  readonly calibrationMaximumIntensityKwPerM: number;
}>;
export type Output = Readonly<{ readonly modelFlameLengthM: number }>;
const inputFields = [
  {
    id: "firelineIntensityKwPerM",
    label: "Fireline intensity kw per m",
    kind: "number",
  },
  {
    id: "calibratedFlameLengthCoefficient",
    label: "Calibrated flame length coefficient",
    kind: "number",
  },
  {
    id: "calibratedPowerExponent",
    label: "Calibrated power exponent",
    kind: "number",
  },
  {
    id: "calibrationMaximumIntensityKwPerM",
    label: "Calibration maximum intensity kw per m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.calibratedFlameLengthCoefficient,
    "calibratedFlameLengthCoefficient",
  );
  positive(input.calibratedPowerExponent, "calibratedPowerExponent");
  positive(
    input.calibrationMaximumIntensityKwPerM,
    "calibrationMaximumIntensityKwPerM",
  );
  nonnegative(input.firelineIntensityKwPerM, "firelineIntensityKwPerM");
  if (input.firelineIntensityKwPerM > input.calibrationMaximumIntensityKwPerM)
    simpleError(
      "firelineIntensityKwPerM",
      "Intensity outside supplied flame-length calibration.",
    );
  return {
    modelFlameLengthM:
      input.calibratedFlameLengthCoefficient *
      input.firelineIntensityKwPerM ** input.calibratedPowerExponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firelineIntensityKwPerM: 100,
  calibratedFlameLengthCoefficient: 0.1,
  calibratedPowerExponent: 0.5,
  calibrationMaximumIntensityKwPerM: 1000,
} satisfies Input;
export const exampleOutput = { modelFlameLengthM: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/flame-length-from-fireline-intensity",
  title: "Flame Length From Fireline Intensity",
  description:
    "Apply supplied unit-specific fireline-intensity/flame-length calibration inside its domain; no universal coefficient or tactics/safe-distance determination.",
  inputs: inputFields,
  outputs: [
    { id: "modelFlameLengthM", label: "Model flame length m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firelineIntensityKwPerM: value.firelineIntensityKwPerM as number,
      calibratedFlameLengthCoefficient:
        value.calibratedFlameLengthCoefficient as number,
      calibratedPowerExponent: value.calibratedPowerExponent as number,
      calibrationMaximumIntensityKwPerM:
        value.calibrationMaximumIntensityKwPerM as number,
    }),
});
export const run = tool.execute;
export default tool;
