import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const codonUsageBiasExample = {
  input: { codonOccurrences: 12, totalCodonsOfThatAminoAcid: 48 },
} satisfies ToolExample<{
  readonly codonOccurrences: number;
  readonly totalCodonsOfThatAminoAcid: number;
}>;

export const codonUsageBiasTool = createSimpleTool({
  id: "biology/codon-usage-bias",
  title: "Codon Usage Bias Frequency",
  description:
    "Compute the relative usage frequency of a codon among codons for the same amino acid.",
  inputs: [
    {
      id: "codonOccurrences",
      label: "Codon occurrences",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalCodonsOfThatAminoAcid",
      label: "Total synonymous codons",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [{ id: "usageFrequency", label: "Usage frequency", kind: "number" }],
  calculate: (input) => {
    const codonOccurrences = input.codonOccurrences as number;
    const totalCodonsOfThatAminoAcid =
      input.totalCodonsOfThatAminoAcid as number;
    if (totalCodonsOfThatAminoAcid <= 0)
      simpleError(
        "totalCodonsOfThatAminoAcid",
        "Total codons of the amino acid must be greater than zero.",
        "invalid_total",
      );
    if (codonOccurrences > totalCodonsOfThatAminoAcid)
      simpleError(
        "codonOccurrences",
        "Codon occurrences must not exceed the amino acid total.",
        "exceeds_total",
      );
    return { usageFrequency: codonOccurrences / totalCodonsOfThatAminoAcid };
  },
});
export const runCodonUsageBias = codonUsageBiasTool.execute;
export default codonUsageBiasTool;
