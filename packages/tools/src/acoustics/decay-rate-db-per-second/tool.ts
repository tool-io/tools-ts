import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecayRateDbPerSecondInput = Readonly<{
  readonly rt60Seconds: number;
}>;
export type DecayRateDbPerSecondOutput = Readonly<{
  readonly decibelsPerSecond: number;
}>;

export const calculateDecayRateDbPerSecond = (
  x: DecayRateDbPerSecondInput,
): DecayRateDbPerSecondOutput => {
  if (!Number.isFinite(x.rt60Seconds) || x.rt60Seconds <= 0)
    simpleError("rt60Seconds", "Provide a finite positive number.");
  const decibelsPerSecond = 60 / x.rt60Seconds;
  if (!Number.isFinite(decibelsPerSecond))
    simpleError(
      "decibelsPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    decibelsPerSecond: Object.is(decibelsPerSecond, -0) ? 0 : decibelsPerSecond,
  };
};

export const example = {
  input: {
    rt60Seconds: 2,
  },
  output: { decibelsPerSecond: 30 },
} satisfies ToolExample<DecayRateDbPerSecondInput, DecayRateDbPerSecondOutput>;

export const tool = createSimpleTool({
  id: "acoustics/decay-rate-db-per-second",
  title: "Decay Rate Db Per Second",
  description:
    "Average dB-per-second level decline from an RT60 time interval.",
  inputs: [
    {
      id: "rt60Seconds",
      kind: "number",
      label: "Rt 60 Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "decibelsPerSecond",
      kind: "number",
      label: "Decibels Per Second",
      unit: "dB/s",
    },
  ],
  calculate: (input) =>
    calculateDecayRateDbPerSecond({
      rt60Seconds: input.rt60Seconds as number,
    }),
});
export const decayRateDbPerSecondTool = tool;
export const runDecayRateDbPerSecond = tool.execute;
export default tool;
