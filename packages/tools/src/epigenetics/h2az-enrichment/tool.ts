import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly h2azSignal: number;
  readonly h2aSignal: number;
  readonly background: number;
}>;
export type Output = Readonly<{
  readonly correctedH2az: number;
  readonly enrichmentFold: number;
}>;

export const calculate = (input: Input): Output => {
  const correctedH2az = Math.max(0, input.h2azSignal - input.background),
    ref = Math.max(0, input.h2aSignal - input.background);
  if (ref <= 0)
    simpleError(
      "h2aSignal",
      "Corrected H2A must be positive.",
      "zero_reference",
    );
  return { correctedH2az, enrichmentFold: correctedH2az / ref };
};

export const exampleInput = {
  h2azSignal: 110,
  h2aSignal: 30,
  background: 10,
} satisfies Input;
export const exampleOutput = {
  correctedH2az: 100,
  enrichmentFold: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      h2azSignal: input.h2azSignal as number,
      h2aSignal: input.h2aSignal as number,
      background: input.background as number,
    }),
  description: "Calculate H2A.Z enrichment relative to H2A.",
  id: "epigenetics/h2az-enrichment",
  inputs: [
    { id: "h2azSignal", label: "H2A.Z signal", kind: "number", minimum: 0 },
    { id: "h2aSignal", label: "H2A signal", kind: "number", minimum: 0 },
    { id: "background", label: "Background", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "correctedH2az",
      label: "Corrected H2A.Z",
      kind: "number",
      minimum: 0,
    },
    {
      id: "enrichmentFold",
      label: "Exchange enrichment",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "H2A.Z Enrichment",
});

export const run = tool.execute;
export default tool;
