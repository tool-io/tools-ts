import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PulseRepetitionRangeAmbiguityInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly pulseRepetitionHertz: number;
}>;
export type PulseRepetitionRangeAmbiguityOutput = Readonly<{
  readonly maxRangeMeters: number;
}>;

export const calculatePulseRepetitionRangeAmbiguity = (
  x: PulseRepetitionRangeAmbiguityInput,
): PulseRepetitionRangeAmbiguityOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  if (!Number.isFinite(x.pulseRepetitionHertz) || x.pulseRepetitionHertz <= 0)
    simpleError("pulseRepetitionHertz", "Provide a finite positive number.");
  const maxRangeMeters = x.speedMetersPerSecond / (2 * x.pulseRepetitionHertz);
  if (!Number.isFinite(maxRangeMeters))
    simpleError(
      "maxRangeMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { maxRangeMeters: Object.is(maxRangeMeters, -0) ? 0 : maxRangeMeters };
};

export const example = {
  input: {
    speedMetersPerSecond: 1500,
    pulseRepetitionHertz: 1000,
  },
  output: { maxRangeMeters: 0.75 },
} satisfies ToolExample<
  PulseRepetitionRangeAmbiguityInput,
  PulseRepetitionRangeAmbiguityOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/pulse-repetition-range-ambiguity",
  title: "Pulse Repetition Range Ambiguity",
  description:
    "Maximum unambiguous pulse-echo range c/(2·PRF) for propagation speed and pulse repetition rate.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "pulseRepetitionHertz",
      kind: "number",
      label: "Pulse Repetition Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maxRangeMeters",
      kind: "number",
      label: "Max Range Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculatePulseRepetitionRangeAmbiguity({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      pulseRepetitionHertz: input.pulseRepetitionHertz as number,
    }),
});
export const pulseRepetitionRangeAmbiguityTool = tool;
export const runPulseRepetitionRangeAmbiguity = tool.execute;
export default tool;
