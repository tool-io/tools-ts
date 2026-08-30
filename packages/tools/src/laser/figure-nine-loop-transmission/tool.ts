import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nonlinearPhaseRadians: number;
  readonly insertionTransmission: number;
}>;
export type Output = Readonly<{
  readonly reflectingPortFraction: number;
  readonly transmittedFraction: number;
}>;

export const calculate = (input: Input): Output => {
  const reflectingPortFraction = Math.cos(input.nonlinearPhaseRadians / 2) ** 2;
  return {
    reflectingPortFraction,
    transmittedFraction:
      (1 - reflectingPortFraction) * input.insertionTransmission,
  };
};

export const exampleInput = {
  nonlinearPhaseRadians: 3.141592653589793,
  insertionTransmission: 0.9,
} satisfies Input;
export const exampleOutput = {
  reflectingPortFraction: 3.749399456654644e-33,
  transmittedFraction: 0.9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nonlinearPhaseRadians: input.nonlinearPhaseRadians as number,
      insertionTransmission: input.insertionTransmission as number,
    }),
  description:
    "Calculate idealized complementary-port transmission for a figure-nine nonlinear loop.",
  id: "laser/figure-nine-loop-transmission",
  inputs: [
    {
      id: "nonlinearPhaseRadians",
      label: "Loop nonlinear phase",
      kind: "number",
      unit: "rad",
    },
    {
      id: "insertionTransmission",
      label: "Insertion transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "reflectingPortFraction",
      label: "Reflecting-port fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "transmittedFraction",
      label: "Transmitted fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "Figure-Nine Loop Transmission",
});

export const run = tool.execute;
export default tool;
