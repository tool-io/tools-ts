import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly amplitudeCentimeters: number;
  readonly frequencyHertz: number;
  readonly minimumAmplitudeCentimeters: number;
  readonly maximumAmplitudeCentimeters: number;
  readonly minimumFrequencyHertz: number;
  readonly maximumFrequencyHertz: number;
}>;
export type Output = Readonly<{
  readonly amplitudeWithinRange: boolean;
  readonly frequencyWithinRange: boolean;
  readonly bothWithinRange: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.minimumAmplitudeCentimeters > input.maximumAmplitudeCentimeters ||
    input.minimumFrequencyHertz > input.maximumFrequencyHertz
  )
    simpleError(
      "minimumAmplitudeCentimeters",
      "Minimums cannot exceed maximums.",
      "invalid_range",
    );
  const amplitudeWithinRange =
    input.amplitudeCentimeters >= input.minimumAmplitudeCentimeters &&
    input.amplitudeCentimeters <= input.maximumAmplitudeCentimeters;
  const frequencyWithinRange =
    input.frequencyHertz >= input.minimumFrequencyHertz &&
    input.frequencyHertz <= input.maximumFrequencyHertz;
  return {
    amplitudeWithinRange,
    frequencyWithinRange,
    bothWithinRange: amplitudeWithinRange && frequencyWithinRange,
  };
};

export const exampleInput = {
  amplitudeCentimeters: 20,
  frequencyHertz: 2,
  minimumAmplitudeCentimeters: 15,
  maximumAmplitudeCentimeters: 25,
  minimumFrequencyHertz: 1.5,
  maximumFrequencyHertz: 2.5,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  amplitudeCentimeters: 30,
  frequencyHertz: 2,
  minimumAmplitudeCentimeters: 15,
  maximumAmplitudeCentimeters: 25,
  minimumFrequencyHertz: 1.5,
  maximumFrequencyHertz: 2.5,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      amplitudeCentimeters: input.amplitudeCentimeters as number,
      frequencyHertz: input.frequencyHertz as number,
      minimumAmplitudeCentimeters: input.minimumAmplitudeCentimeters as number,
      maximumAmplitudeCentimeters: input.maximumAmplitudeCentimeters as number,
      minimumFrequencyHertz: input.minimumFrequencyHertz as number,
      maximumFrequencyHertz: input.maximumFrequencyHertz as number,
    }),
  description:
    "Compare measured dolphin-kick amplitude and frequency with caller-supplied ranges.",
  id: "kinesiology/dolphin-kick-wave-screen",
  inputs: [
    {
      id: "amplitudeCentimeters",
      label: "Wave amplitude",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
    {
      id: "frequencyHertz",
      label: "Wave frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "minimumAmplitudeCentimeters",
      label: "Minimum amplitude",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
    {
      id: "maximumAmplitudeCentimeters",
      label: "Maximum amplitude",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
    {
      id: "minimumFrequencyHertz",
      label: "Minimum frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "maximumFrequencyHertz",
      label: "Maximum frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "amplitudeWithinRange",
      label: "Amplitude within range",
      kind: "boolean",
    },
    {
      id: "frequencyWithinRange",
      label: "Frequency within range",
      kind: "boolean",
    },
    { id: "bothWithinRange", label: "Both within range", kind: "boolean" },
  ],
  title: "Dolphin Kick Wave Screen",
});

export const run = tool.execute;
export default tool;
