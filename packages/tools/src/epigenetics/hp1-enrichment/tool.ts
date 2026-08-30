import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hp1Signal: number;
  readonly inputSignal: number;
  readonly background: number;
}>;
export type Output = Readonly<{
  readonly correctedHp1: number;
  readonly enrichmentFold: number;
}>;

export const calculate = (input: Input): Output => {
  const correctedHp1 = Math.max(0, input.hp1Signal - input.background),
    ref = Math.max(0, input.inputSignal - input.background);
  if (ref <= 0)
    simpleError(
      "inputSignal",
      "Corrected input must be positive.",
      "zero_reference",
    );
  return { correctedHp1, enrichmentFold: correctedHp1 / ref };
};

export const exampleInput = {
  hp1Signal: 110,
  inputSignal: 30,
  background: 10,
} satisfies Input;
export const exampleOutput = {
  correctedHp1: 100,
  enrichmentFold: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      hp1Signal: input.hp1Signal as number,
      inputSignal: input.inputSignal as number,
      background: input.background as number,
    }),
  description: "Calculate HP1 enrichment after background correction.",
  id: "epigenetics/hp1-enrichment",
  inputs: [
    { id: "hp1Signal", label: "HP1 signal", kind: "number", minimum: 0 },
    { id: "inputSignal", label: "Input signal", kind: "number", minimum: 0 },
    { id: "background", label: "Background", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "correctedHp1",
      label: "Corrected HP1 signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "enrichmentFold",
      label: "HP1 enrichment",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "HP1 Enrichment",
});

export const run = tool.execute;
export default tool;
