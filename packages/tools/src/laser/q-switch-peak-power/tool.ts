import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pulseEnergyJoules: number;
  readonly pulseWidthSeconds: number;
  readonly repetitionRateHertz: number;
}>;
export type Output = Readonly<{
  readonly peakPowerWatts: number;
  readonly averagePowerWatts: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.pulseWidthSeconds <= 0)
    simpleError(
      "pulseWidthSeconds",
      "Pulse width must be positive.",
      "invalid_duration",
    );
  return {
    peakPowerWatts: (2 * input.pulseEnergyJoules) / input.pulseWidthSeconds,
    averagePowerWatts: input.pulseEnergyJoules * input.repetitionRateHertz,
  };
};

export const exampleInput = {
  pulseEnergyJoules: 0.01,
  pulseWidthSeconds: 1e-8,
  repetitionRateHertz: 1000,
} satisfies Input;
export const exampleOutput = {
  peakPowerWatts: 2000000,
  averagePowerWatts: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pulseEnergyJoules: input.pulseEnergyJoules as number,
      pulseWidthSeconds: input.pulseWidthSeconds as number,
      repetitionRateHertz: input.repetitionRateHertz as number,
    }),
  description:
    "Calculate triangular-pulse peak power and pulse-train average power.",
  id: "laser/q-switch-peak-power",
  inputs: [
    {
      id: "pulseEnergyJoules",
      label: "Pulse energy",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "pulseWidthSeconds",
      label: "Triangular pulse width",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "repetitionRateHertz",
      label: "Repetition rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "peakPowerWatts",
      label: "Triangular-model peak power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "averagePowerWatts",
      label: "Average power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  title: "Q-Switch Peak Power",
});

export const run = tool.execute;
export default tool;
