import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly separationMeters: number;
  readonly soundSpeedMetersPerSecond: number;
}>;
export type Output = Readonly<{
  readonly repetitionFrequencyHertz: number;
  readonly roundTripMilliseconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (!Number.isFinite(input.separationMeters) || input.separationMeters <= 0)
    simpleError(
      "separationMeters",
      "Separation must be finite and positive.",
      "invalid_separation",
    );
  if (
    !Number.isFinite(input.soundSpeedMetersPerSecond) ||
    input.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Sound speed must be finite and positive.",
      "invalid_sound_speed",
    );
  const repetitionFrequencyHertz =
    input.soundSpeedMetersPerSecond / (2 * input.separationMeters);
  const roundTripMilliseconds =
    (input.separationMeters / input.soundSpeedMetersPerSecond) * 2000;
  if (
    !Number.isFinite(repetitionFrequencyHertz) ||
    repetitionFrequencyHertz <= 0 ||
    !Number.isFinite(roundTripMilliseconds) ||
    roundTripMilliseconds <= 0
  )
    simpleError(
      "separationMeters",
      "Inputs produce an out-of-range interval.",
      "numeric_overflow",
    );
  return { repetitionFrequencyHertz, roundTripMilliseconds };
};

export const example = {
  input: { separationMeters: 5, soundSpeedMetersPerSecond: 343 },
  output: {
    repetitionFrequencyHertz: 34.3,
    roundTripMilliseconds: 29.154518950437318,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { separationMeters: 171.5, soundSpeedMetersPerSecond: 343 },
  output: { repetitionFrequencyHertz: 1, roundTripMilliseconds: 1000 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      separationMeters: input.separationMeters as number,
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
    }),
  description:
    "Calculate the round-trip interval and repetition frequency between parallel surfaces under a caller-supplied sound speed.",
  id: "acoustics/flutter-echo-frequency",
  inputs: [
    {
      id: "separationMeters",
      kind: "number",
      label: "Surface separation",
      minimum: 0,
      unit: "m",
    },
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound speed",
      minimum: 0,
      unit: "m/s",
    },
  ],
  outputs: [
    {
      id: "repetitionFrequencyHertz",
      kind: "number",
      label: "Repetition frequency",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "roundTripMilliseconds",
      kind: "number",
      label: "Round-trip interval",
      minimum: 0,
      unit: "ms",
    },
  ],
  title: "Flutter Echo Frequency",
});

export const run = tool.execute;
export default tool;
