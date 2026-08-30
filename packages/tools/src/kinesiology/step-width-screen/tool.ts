import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stepWidthCm: number;
  readonly minimumWidthCm: number;
  readonly maximumWidthCm: number;
}>;
export type Output = Readonly<{
  readonly withinRange: boolean;
  readonly marginToMinimumCm: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.stepWidthCm < 0 ||
    input.minimumWidthCm < 0 ||
    input.maximumWidthCm < input.minimumWidthCm
  )
    simpleError(
      "stepWidthCm",
      "Nonnegative measured step width and ordered range required.",
    );
  return {
    withinRange:
      input.stepWidthCm >= input.minimumWidthCm &&
      input.stepWidthCm <= input.maximumWidthCm,
    marginToMinimumCm: input.stepWidthCm - input.minimumWidthCm,
  };
};
export const exampleInput = {
  stepWidthCm: 12,
  minimumWidthCm: 10,
  maximumWidthCm: 20,
} satisfies Input;
export const exampleOutput = {
  withinRange: true,
  marginToMinimumCm: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/step-width-screen",
  title: "Step Width Screen",
  description:
    "Compare step width with caller-provided base-of-support limits.",
  inputs: [
    { id: "stepWidthCm", label: "Step width cm", kind: "number" },
    { id: "minimumWidthCm", label: "Minimum width cm", kind: "number" },
    { id: "maximumWidthCm", label: "Maximum width cm", kind: "number" },
  ],
  outputs: [
    { id: "withinRange", label: "Within range", kind: "boolean" },
    { id: "marginToMinimumCm", label: "Margin to minimum cm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stepWidthCm: value.stepWidthCm as number,
      minimumWidthCm: value.minimumWidthCm as number,
      maximumWidthCm: value.maximumWidthCm as number,
    }),
});
export const run = tool.execute;
export default tool;
