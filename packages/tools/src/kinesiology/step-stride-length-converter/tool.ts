import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stepLengthM: number;
}>;
export type Output = Readonly<{
  readonly strideLengthM: number;
  readonly stepsPerStride: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.stepLengthM <= 0)
    simpleError("stepLengthM", "Positive step length required.");
  return { strideLengthM: 2 * input.stepLengthM, stepsPerStride: 2 };
};
export const exampleInput = { stepLengthM: 0.75 } satisfies Input;
export const exampleOutput = {
  strideLengthM: 1.5,
  stepsPerStride: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/step-stride-length-converter",
  title: "Step Stride Length Converter",
  description:
    "Convert mean step length to bipedal stride length under equal steps.",
  inputs: [{ id: "stepLengthM", label: "Step length m", kind: "number" }],
  outputs: [
    { id: "strideLengthM", label: "Stride length m", kind: "number" },
    { id: "stepsPerStride", label: "Steps per stride", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stepLengthM: value.stepLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
