import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nucleosomeFreeFragments: number;
  readonly totalFragments: number;
}>;
export type Output = Readonly<{
  readonly nucleosomeFreeFraction: number;
  readonly nucleosomeFreePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.nucleosomeFreeFragments > input.totalFragments)
    simpleError(
      "nucleosomeFreeFragments",
      "Free fragments cannot exceed total fragments.",
      "invalid_counts",
    );
  const nucleosomeFreeFraction =
    input.nucleosomeFreeFragments / input.totalFragments;
  return {
    nucleosomeFreeFraction,
    nucleosomeFreePercent: nucleosomeFreeFraction * 100,
  };
};

export const exampleInput = {
  nucleosomeFreeFragments: 600,
  totalFragments: 1000,
} satisfies Input;
export const exampleOutput = {
  nucleosomeFreeFraction: 0.6,
  nucleosomeFreePercent: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nucleosomeFreeFragments: input.nucleosomeFreeFragments as number,
      totalFragments: input.totalFragments as number,
    }),
  description: "Calculate the ATAC nucleosome-free fragment fraction.",
  id: "epigenetics/nucleosome-free-fraction",
  inputs: [
    {
      id: "nucleosomeFreeFragments",
      label: "Nucleosome-free fragments",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalFragments",
      label: "Total fragments",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "nucleosomeFreeFraction",
      label: "Nucleosome-free fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "nucleosomeFreePercent",
      label: "Nucleosome-free percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
  ],
  title: "Nucleosome-Free Fraction",
});

export const run = tool.execute;
export default tool;
