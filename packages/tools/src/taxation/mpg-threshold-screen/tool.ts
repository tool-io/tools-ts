import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly combinedMpg: number;
  readonly minimumMpg: number;
}>;
export type Output = Readonly<{
  readonly mpgMargin: number;
  readonly meetsThreshold: boolean;
  readonly classification: string;
}>;

export const calculate = (input: Input): Output => {
  const mpgMargin = input.combinedMpg - input.minimumMpg;
  return {
    mpgMargin,
    meetsThreshold: mpgMargin >= 0,
    classification: mpgMargin >= 0 ? "meets" : "below",
  };
};

export const exampleInput = {
  combinedMpg: 20,
  minimumMpg: 22.5,
} satisfies Input;
export const exampleOutput = {
  mpgMargin: -2.5,
  meetsThreshold: false,
  classification: "below",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      combinedMpg: input.combinedMpg as number,
      minimumMpg: input.minimumMpg as number,
    }),
  description:
    "Compare combined fuel economy with a caller-supplied tax threshold.",
  id: "taxation/mpg-threshold-screen",
  inputs: [
    {
      id: "combinedMpg",
      label: "Combined fuel economy",
      kind: "number",
      minimum: 0,
      unit: "mpg",
    },
    {
      id: "minimumMpg",
      label: "Minimum fuel economy",
      kind: "number",
      minimum: 0,
      unit: "mpg",
    },
  ],
  outputs: [
    { id: "mpgMargin", label: "MPG margin", kind: "number", unit: "mpg" },
    { id: "meetsThreshold", label: "Meets threshold", kind: "boolean" },
    {
      id: "classification",
      label: "Threshold classification",
      kind: "string",
      enum: ["meets", "below"],
    },
  ],
  title: "MPG Threshold Screen",
});

export const run = tool.execute;
export default tool;
