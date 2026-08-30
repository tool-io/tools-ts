import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly alleleOneCells: number;
  readonly alleleTwoCells: number;
  readonly skewThresholdPercent: number;
}>;
export type Output = Readonly<{
  readonly majorAllelePercent: number;
  readonly skewRatio: number;
  readonly skewed: boolean;
}>;

export const calculate = (input: Input): Output => {
  const total = input.alleleOneCells + input.alleleTwoCells;
  if (total <= 0)
    simpleError(
      "alleleOneCells",
      "Total cells must be positive.",
      "zero_cells",
    );
  const major = Math.max(input.alleleOneCells, input.alleleTwoCells),
    minor = Math.min(input.alleleOneCells, input.alleleTwoCells),
    majorAllelePercent = (major / total) * 100;
  return {
    majorAllelePercent,
    skewRatio: minor === 0 ? major : major / minor,
    skewed: majorAllelePercent >= input.skewThresholdPercent,
  };
};

export const exampleInput = {
  alleleOneCells: 80,
  alleleTwoCells: 20,
  skewThresholdPercent: 75,
} satisfies Input;
export const exampleOutput = {
  majorAllelePercent: 80,
  skewRatio: 4,
  skewed: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      alleleOneCells: input.alleleOneCells as number,
      alleleTwoCells: input.alleleTwoCells as number,
      skewThresholdPercent: input.skewThresholdPercent as number,
    }),
  description: "Classify X-inactivation skew from allele counts.",
  id: "epigenetics/x-inactivation-skew",
  inputs: [
    {
      id: "alleleOneCells",
      label: "Allele-one active cells",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "alleleTwoCells",
      label: "Allele-two active cells",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "skewThresholdPercent",
      label: "Skew threshold",
      kind: "number",
      minimum: 50,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "majorAllelePercent",
      label: "Major allele share",
      kind: "number",
      minimum: 50,
      maximum: 100,
    },
    { id: "skewRatio", label: "Major-minor ratio", kind: "number", minimum: 1 },
    { id: "skewed", label: "Skewed", kind: "boolean" },
  ],
  title: "X-Inactivation Skew",
});

export const run = tool.execute;
export default tool;
