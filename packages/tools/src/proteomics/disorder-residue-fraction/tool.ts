import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly disorderPromotingResidues: string;
}>;
export type Output = Readonly<{
  readonly disorderResidueCount: number;
  readonly disorderResidueFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    disorderResidueCount = [...s].filter((v) =>
      input.disorderPromotingResidues.includes(v),
    ).length;
  return {
    disorderResidueCount,
    disorderResidueFraction: disorderResidueCount / s.length,
  };
};
export const exampleInput = {
  sequence: "PGAA",
  disorderPromotingResidues: "PGQSEK",
} satisfies Input;
export const exampleOutput = {
  disorderResidueCount: 2,
  disorderResidueFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/disorder-residue-fraction",
  title: "Disorder Residue Fraction",
  description:
    "Estimate intrinsic-disorder residue composition using a caller-selected residue set.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "disorderPromotingResidues",
      label: "Disorder promoting residues",
      kind: "string",
    },
  ],
  outputs: [
    {
      id: "disorderResidueCount",
      label: "Disorder residue count",
      kind: "number",
    },
    {
      id: "disorderResidueFraction",
      label: "Disorder residue fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      disorderPromotingResidues: value.disorderPromotingResidues as string,
    }),
});
export const run = tool.execute;
export default tool;
