import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const linkageDisequilibriumR2Example = {
  input: {
    alleleAFrequency: 0.5,
    alleleBFrequency: 0.5,
    dCoefficient: 0.25,
  },
  output: { rSquared: 1 },
} satisfies ToolExample<
  {
    readonly alleleAFrequency: number;
    readonly alleleBFrequency: number;
    readonly dCoefficient: number;
  },
  { readonly rSquared: number }
>;

export const linkageDisequilibriumR2Tool = createSimpleTool({
  id: "biology/linkage-disequilibrium-r2",
  title: "LD R-Squared",
  description:
    "Compute squared linkage disequilibrium r2 = D^2 / (p(A) * (1 - p(A)) * p(B) * (1 - p(B))).",
  inputs: [
    {
      id: "dCoefficient",
      kind: "number",
      label: "LD coefficient D",
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
      id: "rSquared",
      kind: "number",
      label: "r-squared",
    },
  ],
  calculate: (input) => {
    const dCoefficient = input.dCoefficient as number;
    const alleleAFrequency = input.alleleAFrequency as number;
    const alleleBFrequency = input.alleleBFrequency as number;
    const denominator =
      alleleAFrequency *
      (1 - alleleAFrequency) *
      alleleBFrequency *
      (1 - alleleBFrequency);
    if (!(denominator > 0))
      simpleError(
        "alleleAFrequency",
        "Denominator is zero because at least one locus is monomorphic.",
        "monomorphic_locus",
      );
    return { rSquared: (dCoefficient * dCoefficient) / denominator };
  },
});
export const runLinkageDisequilibriumR2 = linkageDisequilibriumR2Tool.execute;
export default linkageDisequilibriumR2Tool;
