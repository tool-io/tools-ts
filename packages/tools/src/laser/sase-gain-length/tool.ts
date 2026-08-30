import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly undulatorLengthMeters: number;
  readonly initialPowerWatts: number;
  readonly finalPowerWatts: number;
}>;
export type Output = Readonly<{
  readonly powerGain: number;
  readonly gainLengthMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.initialPowerWatts <= 0 ||
    input.finalPowerWatts <= input.initialPowerWatts
  )
    simpleError(
      "initialPowerWatts",
      "Final power must exceed a positive initial power.",
      "invalid_gain",
    );
  const powerGain = input.finalPowerWatts / input.initialPowerWatts;
  return {
    powerGain,
    gainLengthMeters: input.undulatorLengthMeters / Math.log(powerGain),
  };
};

export const exampleInput = {
  undulatorLengthMeters: 2.302585092994046,
  initialPowerWatts: 1,
  finalPowerWatts: 10,
} satisfies Input;
export const exampleOutput = {
  powerGain: 10,
  gainLengthMeters: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      undulatorLengthMeters: input.undulatorLengthMeters as number,
      initialPowerWatts: input.initialPowerWatts as number,
      finalPowerWatts: input.finalPowerWatts as number,
    }),
  description: "Infer SASE exponential gain length from measured power growth.",
  id: "laser/sase-gain-length",
  inputs: [
    {
      id: "undulatorLengthMeters",
      label: "Measured amplification length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "initialPowerWatts",
      label: "Initial SASE power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "finalPowerWatts",
      label: "Final SASE power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "powerGain",
      label: "Measured power gain",
      kind: "number",
      minimum: 0,
    },
    {
      id: "gainLengthMeters",
      label: "Exponential gain length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "SASE Gain Length",
});

export const run = tool.execute;
export default tool;
