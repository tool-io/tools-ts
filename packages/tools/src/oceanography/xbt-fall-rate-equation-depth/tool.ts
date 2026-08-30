import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly elapsedSeconds: readonly number[];
  readonly linearFallCoefficientMPerSecond: number;
  readonly quadraticFallCoefficientMPerSecondSquared: number;
  readonly maximumCalibrationTimeSeconds: number;
}>;
export type Output = Readonly<{
  readonly estimatedDepthsM: readonly number[];
  readonly instantaneousDescentRatesMPerSecond: readonly number[];
}>;
const inputFields = [
  { id: "elapsedSeconds", label: "Elapsed seconds", kind: "numberList" },
  {
    id: "linearFallCoefficientMPerSecond",
    label: "Linear fall coefficient m per second",
    kind: "number",
  },
  {
    id: "quadraticFallCoefficientMPerSecondSquared",
    label: "Quadratic fall coefficient m per second squared",
    kind: "number",
  },
  {
    id: "maximumCalibrationTimeSeconds",
    label: "Maximum calibration time seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.linearFallCoefficientMPerSecond,
    "linearFallCoefficientMPerSecond",
  );
  positive(
    input.maximumCalibrationTimeSeconds,
    "maximumCalibrationTimeSeconds",
  );
  input.elapsedSeconds.forEach((v) => nonnegative(v, "elapsedSeconds"));
  nonnegative(
    input.quadraticFallCoefficientMPerSecondSquared,
    "quadraticFallCoefficientMPerSecondSquared",
  );
  if (
    (input.quadraticFallCoefficientMPerSecondSquared > 0 &&
      input.maximumCalibrationTimeSeconds >=
        input.linearFallCoefficientMPerSecond /
          (2 * input.quadraticFallCoefficientMPerSecondSquared)) ||
    input.elapsedSeconds.some((v) => v > input.maximumCalibrationTimeSeconds)
  )
    simpleError(
      "elapsedSeconds",
      "Times within a strictly descending calibrated fall-rate interval required.",
    );
  return {
    estimatedDepthsM: input.elapsedSeconds.map(
      (t) =>
        input.linearFallCoefficientMPerSecond * t -
        input.quadraticFallCoefficientMPerSecondSquared * t * t,
    ),
    instantaneousDescentRatesMPerSecond: input.elapsedSeconds.map(
      (t) =>
        input.linearFallCoefficientMPerSecond -
        2 * input.quadraticFallCoefficientMPerSecondSquared * t,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elapsedSeconds: [0, 1, 2],
  linearFallCoefficientMPerSecond: 6,
  quadraticFallCoefficientMPerSecondSquared: 0.1,
  maximumCalibrationTimeSeconds: 10,
} satisfies Input;
export const exampleOutput = {
  estimatedDepthsM: [0, 5.9, 11.6],
  instantaneousDescentRatesMPerSecond: [6, 5.8, 5.6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/xbt-fall-rate-equation-depth",
  title: "XBT Fall Rate Equation Depth",
  description:
    "Evaluate a caller-calibrated XBT quadratic fall-rate relation only within the supplied valid time horizon; no probe model coefficients or universal depth accuracy embedded.",
  inputs: inputFields,
  outputs: [
    { id: "estimatedDepthsM", label: "Estimated depths m", kind: "numberList" },
    {
      id: "instantaneousDescentRatesMPerSecond",
      label: "Instantaneous descent rates m per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      elapsedSeconds: value.elapsedSeconds as readonly number[],
      linearFallCoefficientMPerSecond:
        value.linearFallCoefficientMPerSecond as number,
      quadraticFallCoefficientMPerSecondSquared:
        value.quadraticFallCoefficientMPerSecondSquared as number,
      maximumCalibrationTimeSeconds:
        value.maximumCalibrationTimeSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
