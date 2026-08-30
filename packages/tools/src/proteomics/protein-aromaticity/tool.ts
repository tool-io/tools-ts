import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly aromaticResidues: number;
  readonly aromaticFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    aromaticResidues = [...s].filter((v) => "FWY".includes(v)).length;
  return { aromaticResidues, aromaticFraction: aromaticResidues / s.length };
};
export const exampleInput = { sequence: "FWYA" } satisfies Input;
export const exampleOutput = {
  aromaticResidues: 3,
  aromaticFraction: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-aromaticity",
  title: "Protein Aromaticity",
  description:
    "Calculate aromatic F/W/Y residue fraction of a protein sequence.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "aromaticResidues", label: "Aromatic residues", kind: "number" },
    { id: "aromaticFraction", label: "Aromatic fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
