import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nonlinearPhaseRadians: number;
  readonly insertionTransmission: number;
}>;
export type Output = Readonly<{
  readonly switchingTransmission: number;
  readonly outputTransmission: number;
}>;

export const calculate = (input: Input): Output => {
  const switchingTransmission = Math.sin(input.nonlinearPhaseRadians / 2) ** 2;
  return {
    switchingTransmission,
    outputTransmission: switchingTransmission * input.insertionTransmission,
  };
};

export const exampleInput = {
  nonlinearPhaseRadians: 3.141592653589793,
  insertionTransmission: 0.8,
} satisfies Input;
export const exampleOutput = {
  switchingTransmission: 1,
  outputTransmission: 0.8,
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
    "Calculate an idealized nonlinear-loop-mirror transmission for a figure-eight cavity.",
  id: "laser/figure-eight-loop-transmission",
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
      id: "switchingTransmission",
      label: "Figure-eight switching transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "outputTransmission",
      label: "Transmission after insertion loss",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "Figure-Eight Loop Transmission",
});

export const run = tool.execute;
export default tool;
