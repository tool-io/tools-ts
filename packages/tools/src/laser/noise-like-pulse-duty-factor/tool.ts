import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly noiseBurstDurationSeconds: number;
  readonly repetitionRateHertz: number;
  readonly averagePowerWatts: number;
}>;
export type Output = Readonly<{
  readonly dutyFactor: number;
  readonly pulseEnergyJoules: number;
  readonly inBurstAveragePowerWatts: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.repetitionRateHertz <= 0 || input.noiseBurstDurationSeconds <= 0)
    simpleError(
      "repetitionRateHertz",
      "Burst duration and repetition rate must be positive.",
      "invalid_pulse_train",
    );
  const dutyFactor =
    input.noiseBurstDurationSeconds * input.repetitionRateHertz;
  const pulseEnergyJoules = input.averagePowerWatts / input.repetitionRateHertz;
  return {
    dutyFactor,
    pulseEnergyJoules,
    inBurstAveragePowerWatts: input.averagePowerWatts / dutyFactor,
  };
};

export const exampleInput = {
  noiseBurstDurationSeconds: 1e-6,
  repetitionRateHertz: 1000,
  averagePowerWatts: 1,
} satisfies Input;
export const exampleOutput = {
  dutyFactor: 0.001,
  pulseEnergyJoules: 0.001,
  inBurstAveragePowerWatts: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      noiseBurstDurationSeconds: input.noiseBurstDurationSeconds as number,
      repetitionRateHertz: input.repetitionRateHertz as number,
      averagePowerWatts: input.averagePowerWatts as number,
    }),
  description:
    "Calculate noise-like burst duty factor, burst energy, and in-burst average power.",
  id: "laser/noise-like-pulse-duty-factor",
  inputs: [
    {
      id: "noiseBurstDurationSeconds",
      label: "Noise-like burst duration",
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
    {
      id: "averagePowerWatts",
      label: "Average power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "dutyFactor",
      label: "Burst duty factor",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pulseEnergyJoules",
      label: "Burst energy",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "inBurstAveragePowerWatts",
      label: "Average power within burst",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  title: "Noise-Like Pulse Duty Factor",
});

export const run = tool.execute;
export default tool;
