import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inclusionJunctionReads: number;
  readonly skippingJunctionReads: number;
  readonly minimumPsiPercent: number;
}>;
export type Output = Readonly<{
  readonly psiPercent: number;
  readonly skippingPercent: number;
  readonly included: boolean;
}>;

export const calculate = (input: Input): Output => {
  const total = input.inclusionJunctionReads + input.skippingJunctionReads;
  if (
    total <= 0 ||
    input.inclusionJunctionReads < 0 ||
    input.skippingJunctionReads < 0
  )
    simpleError(
      "inclusionJunctionReads",
      "Nonnegative junction counts with positive total required.",
    );
  const psiPercent = (input.inclusionJunctionReads / total) * 100;
  return {
    psiPercent,
    skippingPercent: 100 - psiPercent,
    included: psiPercent >= input.minimumPsiPercent,
  };
};

export const exampleInput = {
  inclusionJunctionReads: 80,
  skippingJunctionReads: 20,
  minimumPsiPercent: 50,
} satisfies Input;
export const exampleOutput = {
  psiPercent: 80,
  skippingPercent: 20,
  included: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/exon-skipping-psi",
  title: "Exon Skipping Psi",
  description:
    "Quantify exon-skipping percent-spliced-in from junction counts.",
  inputs: [
    {
      id: "inclusionJunctionReads",
      kind: "number",
      label: "Inclusion junction reads",
    },
    {
      id: "skippingJunctionReads",
      kind: "number",
      label: "Skipping junction reads",
    },
    { id: "minimumPsiPercent", kind: "number", label: "Minimum psi percent" },
  ],
  outputs: [
    { id: "psiPercent", kind: "number", label: "Psi percent" },
    { id: "skippingPercent", kind: "number", label: "Skipping percent" },
    { id: "included", kind: "boolean", label: "Included" },
  ],
  calculate: (value) =>
    calculate({
      inclusionJunctionReads: value.inclusionJunctionReads as number,
      skippingJunctionReads: value.skippingJunctionReads as number,
      minimumPsiPercent: value.minimumPsiPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
