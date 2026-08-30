import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly combRepetitionRateHertz: number;
}>;
export type Output = Readonly<{
  readonly ambiguityRangeMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.combRepetitionRateHertz <= 0)
    simpleError(
      "combRepetitionRateHertz",
      "Repetition rate must be positive.",
      "invalid_rate",
    );
  return {
    ambiguityRangeMeters: 299792458 / (2 * input.combRepetitionRateHertz),
  };
};

export const exampleInput = {
  combRepetitionRateHertz: 100000000,
} satisfies Input;
export const exampleOutput = {
  ambiguityRangeMeters: 1.49896229,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      combRepetitionRateHertz: input.combRepetitionRateHertz as number,
    }),
  description: "Calculate one-way frequency-comb ranging ambiguity distance.",
  id: "laser/comb-ranging-ambiguity",
  inputs: [
    {
      id: "combRepetitionRateHertz",
      label: "Comb repetition rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "ambiguityRangeMeters",
      label: "One-way ambiguity range",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Comb-Ranging Ambiguity",
});

export const run = tool.execute;
export default tool;
