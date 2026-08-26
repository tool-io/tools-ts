import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const oligoMolecularWeightExample = {
  input: { lengthNt: 21 },
} satisfies ToolExample<{
  readonly lengthNt: number;
}>;

export const oligoMolecularWeightTool = createSimpleTool({
  id: "biology/oligo-molecular-weight",
  title: "Oligo MW Approx",
  description:
    "Approximate single-stranded oligonucleotide molecular weight as nucleotide length times the average nucleotide mass of 330 grams per mole.",
  inputs: [
    {
      id: "lengthNt",
      label: "Length nt",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "oligoMolecularWeightDa",
      label: "Oligo molecular weight Da",
      kind: "number",
      unit: "Da",
    },
  ],
  calculate: (input) => {
    const lengthNt = input.lengthNt as number;
    return {
      oligoMolecularWeightDa: lengthNt * 330,
    };
  },
});
export const runOligoMolecularWeight = oligoMolecularWeightTool.execute;
export default oligoMolecularWeightTool;
