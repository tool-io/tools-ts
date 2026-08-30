import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly kneeHorizontalCm: number;
  readonly pedalSpindleHorizontalCm: number;
  readonly maximumOffsetCm: number;
}>;
export type Output = Readonly<{
  readonly kneeAheadCm: number;
  readonly withinTolerance: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.maximumOffsetCm < 0)
    simpleError(
      "maximumOffsetCm",
      "Nonnegative knee-to-spindle offset tolerance required.",
    );
  const kneeAheadCm = input.kneeHorizontalCm - input.pedalSpindleHorizontalCm;
  return {
    kneeAheadCm,
    withinTolerance: Math.abs(kneeAheadCm) <= input.maximumOffsetCm,
  };
};
export const exampleInput = {
  kneeHorizontalCm: 2,
  pedalSpindleHorizontalCm: 0,
  maximumOffsetCm: 3,
} satisfies Input;
export const exampleOutput = {
  kneeAheadCm: 2,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/knee-over-pedal-offset",
  title: "Knee Over Pedal Offset",
  description:
    "Measure knee-over-pedal-spindle horizontal offset at a specified crank position.",
  inputs: [
    { id: "kneeHorizontalCm", label: "Knee horizontal cm", kind: "number" },
    {
      id: "pedalSpindleHorizontalCm",
      label: "Pedal spindle horizontal cm",
      kind: "number",
    },
    { id: "maximumOffsetCm", label: "Maximum offset cm", kind: "number" },
  ],
  outputs: [
    { id: "kneeAheadCm", label: "Knee ahead cm", kind: "number" },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      kneeHorizontalCm: value.kneeHorizontalCm as number,
      pedalSpindleHorizontalCm: value.pedalSpindleHorizontalCm as number,
      maximumOffsetCm: value.maximumOffsetCm as number,
    }),
});
export const run = tool.execute;
export default tool;
