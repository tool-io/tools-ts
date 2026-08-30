import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly floorNaturalFrequencyHertz: number;
  readonly forcingFrequencyHertz: number;
  readonly minimumSeparationHertz: number;
}>;
export type Output = Readonly<{
  readonly frequencySeparationHertz: number;
  readonly nearCallerResonanceBand: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Frequencies and separation must be finite and nonnegative.",
        "invalid_frequency",
      );
  if (
    input.floorNaturalFrequencyHertz === 0 ||
    input.forcingFrequencyHertz === 0
  )
    simpleError(
      "floorNaturalFrequencyHertz",
      "Frequencies must be positive.",
      "invalid_frequency",
    );
  const frequencySeparationHertz = Math.abs(
    input.floorNaturalFrequencyHertz - input.forcingFrequencyHertz,
  );
  if (!Number.isFinite(frequencySeparationHertz))
    simpleError(
      "floorNaturalFrequencyHertz",
      "Frequency separation is out of range.",
      "numeric_overflow",
    );
  return {
    frequencySeparationHertz,
    nearCallerResonanceBand:
      frequencySeparationHertz <= input.minimumSeparationHertz,
  };
};

export const example = {
  input: {
    floorNaturalFrequencyHertz: 8,
    forcingFrequencyHertz: 7.5,
    minimumSeparationHertz: 1,
  },
  output: { frequencySeparationHertz: 0.5, nearCallerResonanceBand: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    floorNaturalFrequencyHertz: 10,
    forcingFrequencyHertz: 2,
    minimumSeparationHertz: 1,
  },
  output: { frequencySeparationHertz: 8, nearCallerResonanceBand: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      floorNaturalFrequencyHertz: input.floorNaturalFrequencyHertz as number,
      forcingFrequencyHertz: input.forcingFrequencyHertz as number,
      minimumSeparationHertz: input.minimumSeparationHertz as number,
    }),
  description:
    "Screen the separation between a floor natural frequency and a caller-supplied forcing frequency; it is not a full AISC Design Guide 11 response analysis.",
  id: "acoustics/floor-footfall-frequency-screen",
  inputs: [
    {
      id: "floorNaturalFrequencyHertz",
      kind: "number",
      label: "Floor natural frequency",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "forcingFrequencyHertz",
      kind: "number",
      label: "Forcing frequency",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "minimumSeparationHertz",
      kind: "number",
      label: "Caller resonance-band half-width",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "frequencySeparationHertz",
      kind: "number",
      label: "Frequency separation",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "nearCallerResonanceBand",
      kind: "boolean",
      label: "Near caller resonance band",
    },
  ],
  title: "Floor Footfall Frequency Screen",
});

export const run = tool.execute;
export default tool;
