import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly absorbedPumpPowerWatts: number;
  readonly thresholdPumpPowerWatts: number;
}>;
export type Output = Readonly<{
  readonly pumpRatio: number;
  readonly powerMarginWatts: number;
  readonly aboveThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.thresholdPumpPowerWatts <= 0)
    simpleError(
      "thresholdPumpPowerWatts",
      "Threshold power must be positive.",
      "invalid_threshold",
    );
  return {
    pumpRatio: input.absorbedPumpPowerWatts / input.thresholdPumpPowerWatts,
    powerMarginWatts:
      input.absorbedPumpPowerWatts - input.thresholdPumpPowerWatts,
    aboveThreshold:
      input.absorbedPumpPowerWatts >= input.thresholdPumpPowerWatts,
  };
};

export const exampleInput = {
  absorbedPumpPowerWatts: 12,
  thresholdPumpPowerWatts: 10,
} satisfies Input;
export const exampleOutput = {
  pumpRatio: 1.2,
  powerMarginWatts: 2,
  aboveThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      absorbedPumpPowerWatts: input.absorbedPumpPowerWatts as number,
      thresholdPumpPowerWatts: input.thresholdPumpPowerWatts as number,
    }),
  description:
    "Compare absorbed pump power with a supplied rare-gas laser threshold.",
  id: "laser/rare-gas-pump-threshold",
  inputs: [
    {
      id: "absorbedPumpPowerWatts",
      label: "Absorbed pump power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "thresholdPumpPowerWatts",
      label: "Threshold pump power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "pumpRatio",
      label: "Pump-to-threshold ratio",
      kind: "number",
      minimum: 0,
    },
    { id: "powerMarginWatts", label: "Pump margin", kind: "number", unit: "W" },
    { id: "aboveThreshold", label: "Above threshold", kind: "boolean" },
  ],
  title: "Rare-Gas Pump Threshold",
});

export const run = tool.execute;
export default tool;
