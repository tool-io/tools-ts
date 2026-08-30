import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, regression } from "../shared.js";
export type Input = Readonly<{
  readonly targetSpeeds: readonly number[];
  readonly eyeSpeeds: readonly number[];
  readonly usableFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly pursuitGain: number;
  readonly velocityBias: number;
  readonly rSquared: number;
  readonly usedSamples: number;
}>;
const inputFields = [
  { id: "targetSpeeds", label: "Target speeds", kind: "numberList" },
  { id: "eyeSpeeds", label: "Eye speeds", kind: "numberList" },
  { id: "usableFlags", label: "Usable flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.targetSpeeds, input.eyeSpeeds, "targetSpeeds");
  aligned(input.targetSpeeds, input.usableFlags, "targetSpeeds");
  input.usableFlags.forEach((v) => {
    if (v !== 0 && v !== 1)
      simpleError("usableFlags", "Binary usable-sample flags required.");
  });
  const x = input.targetSpeeds.filter((_, i) => input.usableFlags[i] === 1),
    y = input.eyeSpeeds.filter((_, i) => input.usableFlags[i] === 1),
    fit = regression(x, y);
  return {
    pursuitGain: fit.slope,
    velocityBias: fit.intercept,
    rSquared: fit.rSquared,
    usedSamples: x.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetSpeeds: [-2, -1, 1, 2],
  eyeSpeeds: [-1, -0.5, 0.5, 1],
  usableFlags: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  pursuitGain: 0.5,
  velocityBias: 0,
  rSquared: 1,
  usedSamples: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/smooth-pursuit-regression-gain",
  title: "Smooth Pursuit Gain",
  description:
    "Fit eye velocity against target velocity after caller-supplied saccade/blink exclusions; signed slope and intercept are preserved.",
  inputs: inputFields,
  outputs: [
    { id: "pursuitGain", label: "Pursuit gain", kind: "number" },
    { id: "velocityBias", label: "Velocity bias", kind: "number" },
    { id: "rSquared", label: "R squared", kind: "number" },
    { id: "usedSamples", label: "Used samples", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      targetSpeeds: value.targetSpeeds as readonly number[],
      eyeSpeeds: value.eyeSpeeds as readonly number[],
      usableFlags: value.usableFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
