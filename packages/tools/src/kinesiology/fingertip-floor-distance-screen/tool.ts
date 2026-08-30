import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fingertipFloorGapCm: number;
  readonly maximumGapCm: number;
}>;
export type Output = Readonly<{
  readonly marginCm: number;
  readonly withinTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.maximumGapCm < 0)
    simpleError("maximumGapCm", "Gap limit must not be negative.");
  return {
    marginCm: input.maximumGapCm - input.fingertipFloorGapCm,
    withinTarget: input.fingertipFloorGapCm <= input.maximumGapCm,
  };
};
export const exampleInput = {
  fingertipFloorGapCm: 5,
  maximumGapCm: 10,
} satisfies Input;
export const exampleOutput = {
  marginCm: 5,
  withinTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/fingertip-floor-distance-screen",
  title: "Fingertip Floor Distance Screen",
  description:
    "Screen fingertip-to-floor distance with a caller-provided flexibility limit.",
  inputs: [
    {
      id: "fingertipFloorGapCm",
      label: "Fingertip floor gap cm",
      kind: "number",
    },
    { id: "maximumGapCm", label: "Maximum gap cm", kind: "number" },
  ],
  outputs: [
    { id: "marginCm", label: "Margin cm", kind: "number" },
    { id: "withinTarget", label: "Within target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      fingertipFloorGapCm: value.fingertipFloorGapCm as number,
      maximumGapCm: value.maximumGapCm as number,
    }),
});
export const run = tool.execute;
export default tool;
