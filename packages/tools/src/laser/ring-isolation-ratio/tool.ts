import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly forwardPowerWatts: number;
  readonly reversePowerWatts: number;
}>;
export type Output = Readonly<{
  readonly isolationRatio: number;
  readonly isolationDecibels: number;
  readonly reverseFraction: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.reversePowerWatts <= 0 ||
    input.forwardPowerWatts + input.reversePowerWatts <= 0
  )
    simpleError(
      "reversePowerWatts",
      "Reverse power and total power must be positive.",
      "invalid_power",
    );
  const isolationRatio = input.forwardPowerWatts / input.reversePowerWatts;
  return {
    isolationRatio,
    isolationDecibels: 10 * Math.log10(isolationRatio),
    reverseFraction:
      input.reversePowerWatts /
      (input.forwardPowerWatts + input.reversePowerWatts),
  };
};

export const exampleInput = {
  forwardPowerWatts: 100,
  reversePowerWatts: 1,
} satisfies Input;
export const exampleOutput = {
  isolationRatio: 100,
  isolationDecibels: 20,
  reverseFraction: 0.009900990099009901,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      forwardPowerWatts: input.forwardPowerWatts as number,
      reversePowerWatts: input.reversePowerWatts as number,
    }),
  description:
    "Calculate forward/reverse isolation in a unidirectional ring cavity.",
  id: "laser/ring-isolation-ratio",
  inputs: [
    {
      id: "forwardPowerWatts",
      label: "Forward circulating power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "reversePowerWatts",
      label: "Reverse circulating power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "isolationRatio",
      label: "Forward-to-reverse power ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "isolationDecibels",
      label: "Ring isolation",
      kind: "number",
      unit: "dB",
    },
    {
      id: "reverseFraction",
      label: "Reverse power fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "Ring Isolation Ratio",
});

export const run = tool.execute;
export default tool;
