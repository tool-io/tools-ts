import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly leftFlank: number;
  readonly centerSignal: number;
  readonly rightFlank: number;
  readonly minimumDepthPercent: number;
}>;
export type Output = Readonly<{
  readonly depthPercent: number;
  readonly protected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const flank = (input.leftFlank + input.rightFlank) / 2;
  if (flank <= 0)
    simpleError("leftFlank", "Mean flank must be positive.", "zero_flank");
  const depthPercent = ((flank - input.centerSignal) / flank) * 100;
  return { depthPercent, protected: depthPercent >= input.minimumDepthPercent };
};

export const exampleInput = {
  leftFlank: 100,
  centerSignal: 40,
  rightFlank: 100,
  minimumDepthPercent: 50,
} satisfies Input;
export const exampleOutput = {
  depthPercent: 60,
  protected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      leftFlank: input.leftFlank as number,
      centerSignal: input.centerSignal as number,
      rightFlank: input.rightFlank as number,
      minimumDepthPercent: input.minimumDepthPercent as number,
    }),
  description: "Measure DNase footprint depth relative to flanks.",
  id: "epigenetics/dnase-footprint-depth",
  inputs: [
    { id: "leftFlank", label: "Left flank signal", kind: "number", minimum: 0 },
    {
      id: "centerSignal",
      label: "Footprint signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "rightFlank",
      label: "Right flank signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumDepthPercent",
      label: "Minimum depth",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "depthPercent", label: "Footprint depth", kind: "number", unit: "%" },
    { id: "protected", label: "Protected footprint", kind: "boolean" },
  ],
  title: "DNase Footprint Depth",
});

export const run = tool.execute;
export default tool;
