import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inputBrightness: number;
  readonly outputBrightness: number;
  readonly maximumLossPercent: number;
}>;
export type Output = Readonly<{
  readonly brightnessRetentionPercent: number;
  readonly brightnessLossPercent: number;
  readonly withinLossLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.inputBrightness <= 0)
    simpleError(
      "inputBrightness",
      "Input brightness must be positive.",
      "invalid_brightness",
    );
  const brightnessRetentionPercent =
    (input.outputBrightness / input.inputBrightness) * 100;
  const brightnessLossPercent = 100 - brightnessRetentionPercent;
  return {
    brightnessRetentionPercent,
    brightnessLossPercent,
    withinLossLimit: brightnessLossPercent <= input.maximumLossPercent,
  };
};

export const exampleInput = {
  inputBrightness: 100,
  outputBrightness: 95,
  maximumLossPercent: 10,
} satisfies Input;
export const exampleOutput = {
  brightnessRetentionPercent: 95,
  brightnessLossPercent: 5,
  withinLossLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      inputBrightness: input.inputBrightness as number,
      outputBrightness: input.outputBrightness as number,
      maximumLossPercent: input.maximumLossPercent as number,
    }),
  description:
    "Measure brightness retention through a tapered double-clad section against a caller limit.",
  id: "laser/brightness-conservation",
  inputs: [
    {
      id: "inputBrightness",
      label: "Input brightness",
      kind: "number",
      minimum: 0,
    },
    {
      id: "outputBrightness",
      label: "Output brightness",
      kind: "number",
      minimum: 0,
    },
    {
      id: "maximumLossPercent",
      label: "Maximum brightness loss",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "brightnessRetentionPercent",
      label: "Brightness retention",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "brightnessLossPercent",
      label: "Brightness loss",
      kind: "number",
      unit: "%",
    },
    { id: "withinLossLimit", label: "Within loss limit", kind: "boolean" },
  ],
  title: "Brightness Conservation",
});

export const run = tool.execute;
export default tool;
