import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly averagePowerWatts: number;
  readonly pulseRateHertz: number;
  readonly pulseWidthSeconds: number;
}>;
export type Output = Readonly<{
  readonly pulseEnergyJoules: number;
  readonly rectangularPeakPowerWatts: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.pulseRateHertz <= 0 || input.pulseWidthSeconds <= 0)
    simpleError(
      "pulseRateHertz",
      "Pulse rate and width must be positive.",
      "invalid_pulse",
    );
  const pulseEnergyJoules = input.averagePowerWatts / input.pulseRateHertz;
  return {
    pulseEnergyJoules,
    rectangularPeakPowerWatts: pulseEnergyJoules / input.pulseWidthSeconds,
  };
};

export const exampleInput = {
  averagePowerWatts: 10,
  pulseRateHertz: 10000,
  pulseWidthSeconds: 1e-8,
} satisfies Input;
export const exampleOutput = {
  pulseEnergyJoules: 0.001,
  rectangularPeakPowerWatts: 100000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      averagePowerWatts: input.averagePowerWatts as number,
      pulseRateHertz: input.pulseRateHertz as number,
      pulseWidthSeconds: input.pulseWidthSeconds as number,
    }),
  description:
    "Calculate pulse energy and rectangular peak power for a copper-vapor pulse train.",
  id: "laser/copper-vapor-pulse-energy",
  inputs: [
    {
      id: "averagePowerWatts",
      label: "Average power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "pulseRateHertz",
      label: "Pulse rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "pulseWidthSeconds",
      label: "Pulse width",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "pulseEnergyJoules",
      label: "Pulse energy",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "rectangularPeakPowerWatts",
      label: "Rectangular-pulse peak power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  title: "Copper-Vapor Pulse Energy",
});

export const run = tool.execute;
export default tool;
