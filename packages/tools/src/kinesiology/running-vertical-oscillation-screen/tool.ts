import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly verticalOscillationCm: number;
  readonly strideLengthCm: number;
  readonly maximumOscillationPercent: number;
}>;
export type Output = Readonly<{
  readonly oscillationToStridePercent: number;
  readonly withinTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.verticalOscillationCm < 0 ||
    input.strideLengthCm <= 0 ||
    input.maximumOscillationPercent < 0
  )
    simpleError(
      "strideLengthCm",
      "Nonnegative vertical oscillation and positive stride length required.",
    );
  const oscillationToStridePercent =
    (100 * input.verticalOscillationCm) / input.strideLengthCm;
  return {
    oscillationToStridePercent,
    withinTarget: oscillationToStridePercent <= input.maximumOscillationPercent,
  };
};
export const exampleInput = {
  verticalOscillationCm: 8,
  strideLengthCm: 160,
  maximumOscillationPercent: 8,
} satisfies Input;
export const exampleOutput = {
  oscillationToStridePercent: 5,
  withinTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/running-vertical-oscillation-screen",
  title: "Running Vertical Oscillation Screen",
  description:
    "Compare running vertical oscillation to stride length and a chosen ceiling.",
  inputs: [
    {
      id: "verticalOscillationCm",
      label: "Vertical oscillation cm",
      kind: "number",
    },
    { id: "strideLengthCm", label: "Stride length cm", kind: "number" },
    {
      id: "maximumOscillationPercent",
      label: "Maximum oscillation percent",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "oscillationToStridePercent",
      label: "Oscillation to stride percent",
      kind: "number",
    },
    { id: "withinTarget", label: "Within target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      verticalOscillationCm: value.verticalOscillationCm as number,
      strideLengthCm: value.strideLengthCm as number,
      maximumOscillationPercent: value.maximumOscillationPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
