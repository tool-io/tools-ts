import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBaseIterations: number;
  readonly observedBaseMilliseconds: number;
  readonly observedDoubledIterations: number;
  readonly observedDoubledMilliseconds: number;
  readonly callerMaximumRelativeDoublingDeviation: number;
}>;
export type Output = Readonly<{
  readonly observedIterationFactor: number;
  readonly observedTimeFactor: number;
  readonly signedRelativeScalingDeviation: number;
  readonly withinCallerScalingDeviation: boolean;
}>;
const inputFields = [
  {
    id: "observedBaseIterations",
    label: "Observed base iterations",
    kind: "number",
  },
  {
    id: "observedBaseMilliseconds",
    label: "Observed base milliseconds",
    kind: "number",
  },
  {
    id: "observedDoubledIterations",
    label: "Observed doubled iterations",
    kind: "number",
  },
  {
    id: "observedDoubledMilliseconds",
    label: "Observed doubled milliseconds",
    kind: "number",
  },
  {
    id: "callerMaximumRelativeDoublingDeviation",
    label: "Caller maximum relative doubling deviation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedBaseIterations, "iterations", 1, 1000000000);
  bounded(input.observedDoubledIterations, "iterations", 1, 1000000000);
  positive(input.observedBaseMilliseconds, "time");
  positive(input.observedDoubledMilliseconds, "time");
  nonnegative(input.callerMaximumRelativeDoublingDeviation, "tolerance");
  const iterations =
      input.observedDoubledIterations / input.observedBaseIterations,
    time = input.observedDoubledMilliseconds / input.observedBaseMilliseconds,
    deviation = time / iterations - 1;
  return {
    observedIterationFactor: iterations,
    observedTimeFactor: time,
    signedRelativeScalingDeviation: deviation,
    withinCallerScalingDeviation:
      Math.abs(deviation) <= input.callerMaximumRelativeDoublingDeviation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBaseIterations: 100,
  observedBaseMilliseconds: 10,
  observedDoubledIterations: 200,
  observedDoubledMilliseconds: 25,
  callerMaximumRelativeDoublingDeviation: 0.1,
} satisfies Input;
export const exampleOutput = {
  observedIterationFactor: 2,
  observedTimeFactor: 2.5,
  signedRelativeScalingDeviation: 0.25,
  withinCallerScalingDeviation: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/key-derivation-iterations-double-time-checker",
  title: "KDF Iterations Doubling-Time Check",
  description:
    "Audit actual two KDF iteration/time measurements against ideal linear work scaling, distinct from forward bcrypt exponent; no verified benchmark conditions or cost recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIterationFactor",
      label: "Observed iteration factor",
      kind: "number",
    },
    { id: "observedTimeFactor", label: "Observed time factor", kind: "number" },
    {
      id: "signedRelativeScalingDeviation",
      label: "Signed relative scaling deviation",
      kind: "number",
    },
    {
      id: "withinCallerScalingDeviation",
      label: "Within caller scaling deviation",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBaseIterations: value.observedBaseIterations as number,
      observedBaseMilliseconds: value.observedBaseMilliseconds as number,
      observedDoubledIterations: value.observedDoubledIterations as number,
      observedDoubledMilliseconds: value.observedDoubledMilliseconds as number,
      callerMaximumRelativeDoublingDeviation:
        value.callerMaximumRelativeDoublingDeviation as number,
    }),
});
export const run = tool.execute;
export default tool;
