import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const linkageDisequilibriumDExample = {
  input: {
    alleleAFrequency: 0.5,
    alleleBFrequency: 0.2,
    haplotypeABFrequency: 0.2,
  },
  output: { dCoefficient: 0.1 },
} satisfies ToolExample<
  {
    readonly alleleAFrequency: number;
    readonly alleleBFrequency: number;
    readonly haplotypeABFrequency: number;
  },
  { readonly dCoefficient: number }
>;

export const linkageDisequilibriumDTool = createSimpleTool({
  id: "biology/linkage-disequilibrium-d",
  title: "LD Coefficient D",
  description:
    "Compute linkage disequilibrium coefficient D = f(AB) - p(A) * p(B); the signed result may be negative.",
  inputs: [
    {
      id: "haplotypeABFrequency",
      kind: "number",
      label: "Haplotype AB frequency",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "alleleAFrequency",
      kind: "number",
      label: "Allele A frequency",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "alleleBFrequency",
      kind: "number",
      label: "Allele B frequency",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dCoefficient",
      kind: "number",
      label: "LD coefficient D",
    },
  ],
  calculate: (input) => ({
    dCoefficient:
      (input.haplotypeABFrequency as number) -
      (input.alleleAFrequency as number) * (input.alleleBFrequency as number),
  }),
});
export const runLinkageDisequilibriumD = linkageDisequilibriumDTool.execute;
export default linkageDisequilibriumDTool;
