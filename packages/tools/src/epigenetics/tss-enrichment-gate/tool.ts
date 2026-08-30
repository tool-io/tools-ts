import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tssCenterSignal: number;
  readonly flankingBackgroundSignal: number;
  readonly minimumEnrichment: number;
}>;
export type Output = Readonly<{
  readonly tssEnrichment: number;
  readonly enrichmentMargin: number;
  readonly passesGate: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.flankingBackgroundSignal <= 0)
    simpleError(
      "flankingBackgroundSignal",
      "Background must be positive.",
      "zero_background",
    );
  const tssEnrichment = input.tssCenterSignal / input.flankingBackgroundSignal;
  return {
    tssEnrichment,
    enrichmentMargin: tssEnrichment - input.minimumEnrichment,
    passesGate: tssEnrichment >= input.minimumEnrichment,
  };
};

export const exampleInput = {
  tssCenterSignal: 100,
  flankingBackgroundSignal: 10,
  minimumEnrichment: 8,
} satisfies Input;
export const exampleOutput = {
  tssEnrichment: 10,
  enrichmentMargin: 2,
  passesGate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      tssCenterSignal: input.tssCenterSignal as number,
      flankingBackgroundSignal: input.flankingBackgroundSignal as number,
      minimumEnrichment: input.minimumEnrichment as number,
    }),
  description: "Calculate TSS enrichment and gate against a supplied minimum.",
  id: "epigenetics/tss-enrichment-gate",
  inputs: [
    {
      id: "tssCenterSignal",
      label: "TSS center signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "flankingBackgroundSignal",
      label: "Flanking background",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumEnrichment",
      label: "Minimum enrichment",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "tssEnrichment",
      label: "TSS enrichment",
      kind: "number",
      minimum: 0,
    },
    { id: "enrichmentMargin", label: "Enrichment margin", kind: "number" },
    { id: "passesGate", label: "Passes gate", kind: "boolean" },
  ],
  title: "TSS Enrichment Gate",
});

export const run = tool.execute;
export default tool;
