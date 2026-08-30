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
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly knownForcesNewtons: readonly number[];
  readonly calibrationReadings: readonly number[];
  readonly measurementReadings: readonly number[];
}>;
export type Output = Readonly<{
  readonly newtonsPerReadingUnit: number;
  readonly forceInterceptNewtons: number;
  readonly estimatedForcesNewtons: readonly number[];
  readonly calibrationRSquared: number;
}>;
const inputFields = [
  {
    id: "knownForcesNewtons",
    label: "Known forces newtons",
    kind: "numberList",
  },
  {
    id: "calibrationReadings",
    label: "Calibration readings",
    kind: "numberList",
  },
  {
    id: "measurementReadings",
    label: "Measurement readings",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.knownForcesNewtons.forEach((v) => nonnegative(v, "knownForcesNewtons"));
  if (!input.measurementReadings.length)
    simpleError("measurementReadings", "Nonempty measurements required.");
  const fit = regression(input.calibrationReadings, input.knownForcesNewtons);
  positive(fit.slope, "calibrationReadings");
  return {
    newtonsPerReadingUnit: fit.slope,
    forceInterceptNewtons: fit.intercept,
    estimatedForcesNewtons: input.measurementReadings.map(
      (v) => fit.intercept + fit.slope * v,
    ),
    calibrationRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  knownForcesNewtons: [0, 10, 20],
  calibrationReadings: [1, 3, 5],
  measurementReadings: [2, 4],
} satisfies Input;
export const exampleOutput = {
  newtonsPerReadingUnit: 5,
  forceInterceptNewtons: -5,
  estimatedForcesNewtons: [5, 15],
  calibrationRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/force-transducer-calibration",
  title: "Muscle Force Quantification Tool",
  description:
    "Fit a linear force-transducer calibration and apply it to recordings, preserving signed estimates outside calibration; no strength norms are embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "newtonsPerReadingUnit",
      label: "Newtons per reading unit",
      kind: "number",
    },
    {
      id: "forceInterceptNewtons",
      label: "Force intercept newtons",
      kind: "number",
    },
    {
      id: "estimatedForcesNewtons",
      label: "Estimated forces newtons",
      kind: "numberList",
    },
    {
      id: "calibrationRSquared",
      label: "Calibration r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      knownForcesNewtons: value.knownForcesNewtons as readonly number[],
      calibrationReadings: value.calibrationReadings as readonly number[],
      measurementReadings: value.measurementReadings as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
