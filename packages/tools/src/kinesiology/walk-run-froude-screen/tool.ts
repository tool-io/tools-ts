import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly walkingSpeedMps: number;
  readonly legLengthM: number;
  readonly gravityMps2: number;
  readonly transitionFroude: number;
}>;
export type Output = Readonly<{
  readonly froudeNumber: number;
  readonly atOrAboveTransition: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.walkingSpeedMps < 0 ||
    input.legLengthM <= 0 ||
    input.gravityMps2 <= 0 ||
    input.transitionFroude < 0
  )
    simpleError(
      "legLengthM",
      "Nonnegative speed, positive leg length/gravity and valid threshold required.",
    );
  const froudeNumber =
    input.walkingSpeedMps ** 2 / (input.gravityMps2 * input.legLengthM);
  return {
    froudeNumber,
    atOrAboveTransition: froudeNumber >= input.transitionFroude,
  };
};
export const exampleInput = {
  walkingSpeedMps: 2,
  legLengthM: 0.8,
  gravityMps2: 10,
  transitionFroude: 0.5,
} satisfies Input;
export const exampleOutput = {
  froudeNumber: 0.5,
  atOrAboveTransition: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/walk-run-froude-screen",
  title: "Walk Run Froude Screen",
  description:
    "Screen a gait-speed Froude number against a caller-selected transition value.",
  inputs: [
    { id: "walkingSpeedMps", label: "Walking speed mps", kind: "number" },
    { id: "legLengthM", label: "Leg length m", kind: "number" },
    { id: "gravityMps2", label: "Gravity mps 2", kind: "number" },
    { id: "transitionFroude", label: "Transition froude", kind: "number" },
  ],
  outputs: [
    { id: "froudeNumber", label: "Froude number", kind: "number" },
    {
      id: "atOrAboveTransition",
      label: "At or above transition",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      walkingSpeedMps: value.walkingSpeedMps as number,
      legLengthM: value.legLengthM as number,
      gravityMps2: value.gravityMps2 as number,
      transitionFroude: value.transitionFroude as number,
    }),
});
export const run = tool.execute;
export default tool;
