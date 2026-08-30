import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, integral } from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly headVelocities: readonly number[];
  readonly eyeVelocities: readonly number[];
}>;
export type Output = Readonly<{
  readonly headDisplacement: number;
  readonly eyeDisplacement: number;
  readonly compensatoryGain: number;
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList" },
  { id: "headVelocities", label: "Head velocities", kind: "numberList" },
  { id: "eyeVelocities", label: "Eye velocities", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const headDisplacement = integral(input.timesSeconds, input.headVelocities),
    eyeDisplacement = integral(input.timesSeconds, input.eyeVelocities);
  if (headDisplacement === 0)
    simpleError(
      "headVelocities",
      "Net head displacement must be nonzero; use a unidirectional impulse window.",
    );
  return {
    headDisplacement,
    eyeDisplacement,
    compensatoryGain: -eyeDisplacement / headDisplacement,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 1, 2],
  headVelocities: [1, 1, 1],
  eyeVelocities: [-0.8, -0.8, -0.8],
} satisfies Input;
export const exampleOutput = {
  headDisplacement: 2,
  eyeDisplacement: -1.6,
  compensatoryGain: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/vestibulo-ocular-area-gain",
  title: "Vestibulo-Ocular Gain",
  description:
    "Integrate signed head and eye velocity over a supplied impulse window and compute compensatory area gain; corrective saccades must be excluded by the caller.",
  inputs: inputFields,
  outputs: [
    { id: "headDisplacement", label: "Head displacement", kind: "number" },
    { id: "eyeDisplacement", label: "Eye displacement", kind: "number" },
    { id: "compensatoryGain", label: "Compensatory gain", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      headVelocities: value.headVelocities as readonly number[],
      eyeVelocities: value.eyeVelocities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
