import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProteinMolecularWeightInput = {
  readonly aminoAcids: number;
};

export type ProteinMolecularWeightOutput = {
  readonly molecularWeightDa: number;
};

export const proteinMolecularWeightExample = {
  input: { aminoAcids: 300 },
  output: { molecularWeightDa: 33000 },
} satisfies ToolExample<
  ProteinMolecularWeightInput,
  ProteinMolecularWeightOutput
>;

export const proteinMolecularWeightTool = createSimpleTool({
  id: "biology/protein-molecular-weight",
  title: "Protein MW From Length",
  description:
    "Estimate protein molecular weight from residue count using the mean residue mass of 110 daltons.",
  inputs: [{ id: "aminoAcids", label: "Amino acid count", kind: "integer" }],
  outputs: [
    {
      id: "molecularWeightDa",
      label: "Molecular weight",
      kind: "number",
      unit: "Da",
    },
  ],
  calculate: (input) => {
    const aminoAcids = input.aminoAcids as number;
    if (!(aminoAcids >= 1))
      simpleError(
        "aminoAcids",
        "Residue count must be an integer of at least one.",
        "invalid_length",
      );
    return { molecularWeightDa: aminoAcids * 110 };
  },
});
export const runProteinMolecularWeight = proteinMolecularWeightTool.execute;
export default proteinMolecularWeightTool;
