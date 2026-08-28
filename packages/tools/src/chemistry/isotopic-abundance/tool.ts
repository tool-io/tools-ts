import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const isotopicAbundanceTool = createSimpleTool({
  id: "chemistry/isotopic-abundance",
  title: "Isotopic Abundance Calculator",
  description:
    "Solve the two-isotope percent abundances that produce a known weighted-average atomic mass.",
  inputs: [
    {
      description: "Mass of the first isotope.",
      id: "isotopeMass1U",
      label: "Isotope 1 mass",
      kind: "number",
      unit: "u",
    },
    {
      description: "Mass of the second isotope.",
      id: "isotopeMass2U",
      label: "Isotope 2 mass",
      kind: "number",
      unit: "u",
    },
    {
      description: "Published average atomic mass.",
      id: "averageMassU",
      label: "Average mass",
      kind: "number",
      minimum: 0,
      unit: "u",
    },
  ],
  outputs: [
    {
      description: "Percent abundance of the first isotope.",
      id: "isotope1Percent",
      label: "Isotope 1 abundance",
      kind: "number",
      unit: "%",
    },
    {
      description: "Percent abundance of the second isotope.",
      id: "isotope2Percent",
      label: "Isotope 2 abundance",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const m1 = input.isotopeMass1U as number;
    const m2 = input.isotopeMass2U as number;
    if (m1 === m2)
      simpleError(
        "isotopeMass1U",
        "The isotope masses must differ to solve for abundances.",
        "invalid_isotope_masses",
      );
    const fraction = ((input.averageMassU as number) - m2) / (m1 - m2);
    if (fraction < 0 || fraction > 1)
      simpleError(
        "averageMassU",
        "Average mass must lie between the two isotope masses.",
        "average_out_of_range",
      );
    return {
      isotope1Percent: fraction * 100,
      isotope2Percent: (1 - fraction) * 100,
    };
  },
});
export const runIsotopicAbundance = isotopicAbundanceTool.execute;
export default isotopicAbundanceTool;

export type IsotopicAbundanceInput = {
  readonly isotopeMass1U: number;
  readonly isotopeMass2U: number;
  readonly averageMassU: number;
};

export type IsotopicAbundanceOutput = {
  readonly isotope1Percent: number;
  readonly isotope2Percent: number;
};

export const isotopicAbundanceExample = {
  input: {
    isotopeMass1U: 2,
    isotopeMass2U: 1,
    averageMassU: 1,
  },
  output: {
    isotope1Percent: 0,
    isotope2Percent: 100,
  },
} satisfies ToolExample<IsotopicAbundanceInput, IsotopicAbundanceOutput>;
