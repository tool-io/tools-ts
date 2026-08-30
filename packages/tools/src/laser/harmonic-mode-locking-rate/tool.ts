import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fundamentalRepetitionRateHertz: number;
  readonly harmonicOrder: number;
}>;
export type Output = Readonly<{
  readonly harmonicRepetitionRateHertz: number;
  readonly pulseSpacingSeconds: number;
  readonly pulsesPerFundamentalRoundTrip: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.fundamentalRepetitionRateHertz <= 0)
    simpleError(
      "fundamentalRepetitionRateHertz",
      "Fundamental rate must be positive.",
      "invalid_rate",
    );
  const harmonicRepetitionRateHertz =
    input.fundamentalRepetitionRateHertz * input.harmonicOrder;
  return {
    harmonicRepetitionRateHertz,
    pulseSpacingSeconds: 1 / harmonicRepetitionRateHertz,
    pulsesPerFundamentalRoundTrip: input.harmonicOrder,
  };
};

export const exampleInput = {
  fundamentalRepetitionRateHertz: 1000000,
  harmonicOrder: 10,
} satisfies Input;
export const exampleOutput = {
  harmonicRepetitionRateHertz: 10000000,
  pulseSpacingSeconds: 1e-7,
  pulsesPerFundamentalRoundTrip: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fundamentalRepetitionRateHertz:
        input.fundamentalRepetitionRateHertz as number,
      harmonicOrder: input.harmonicOrder as number,
    }),
  description: "Calculate harmonic mode-locking pulse rate and spacing.",
  id: "laser/harmonic-mode-locking-rate",
  inputs: [
    {
      id: "fundamentalRepetitionRateHertz",
      label: "Fundamental repetition rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "harmonicOrder",
      label: "Harmonic order",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "harmonicRepetitionRateHertz",
      label: "Harmonic repetition rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "pulseSpacingSeconds",
      label: "Harmonic pulse spacing",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "pulsesPerFundamentalRoundTrip",
      label: "Pulses per fundamental round trip",
      kind: "integer",
      minimum: 1,
    },
  ],
  title: "Harmonic Mode-Locking Rate",
});

export const run = tool.execute;
export default tool;
