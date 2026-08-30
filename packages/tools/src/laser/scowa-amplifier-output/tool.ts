import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inputPowerWatts: number;
  readonly smallSignalGainDb: number;
  readonly saturationOutputWatts: number;
}>;
export type Output = Readonly<{
  readonly unsaturatedOutputWatts: number;
  readonly estimatedOutputWatts: number;
  readonly saturationLimited: boolean;
}>;

export const calculate = (input: Input): Output => {
  const unsaturatedOutputWatts =
    input.inputPowerWatts * 10 ** (input.smallSignalGainDb / 10);
  return {
    unsaturatedOutputWatts,
    estimatedOutputWatts: Math.min(
      unsaturatedOutputWatts,
      input.saturationOutputWatts,
    ),
    saturationLimited: unsaturatedOutputWatts > input.saturationOutputWatts,
  };
};

export const exampleInput = {
  inputPowerWatts: 1,
  smallSignalGainDb: 20,
  saturationOutputWatts: 50,
} satisfies Input;
export const exampleOutput = {
  unsaturatedOutputWatts: 100,
  estimatedOutputWatts: 50,
  saturationLimited: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      inputPowerWatts: input.inputPowerWatts as number,
      smallSignalGainDb: input.smallSignalGainDb as number,
      saturationOutputWatts: input.saturationOutputWatts as number,
    }),
  description:
    "Estimate SCOWA output from small-signal gain and a supplied saturation ceiling.",
  id: "laser/scowa-amplifier-output",
  inputs: [
    {
      id: "inputPowerWatts",
      label: "Input optical power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "smallSignalGainDb",
      label: "Small-signal gain",
      kind: "number",
      unit: "dB",
    },
    {
      id: "saturationOutputWatts",
      label: "Saturation output",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "unsaturatedOutputWatts",
      label: "Unsaturated output",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "estimatedOutputWatts",
      label: "Estimated output",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    { id: "saturationLimited", label: "Saturation limited", kind: "boolean" },
  ],
  title: "SCOWA Amplifier Output",
});

export const run = tool.execute;
export default tool;
