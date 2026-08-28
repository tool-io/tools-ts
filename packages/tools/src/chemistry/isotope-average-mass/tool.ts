import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const isotopeAverageMassTool = createSimpleTool({
  id: "chemistry/isotope-average-mass",
  title: "Isotope Average Mass Calculator",
  description:
    "Compute the weighted-average atomic mass from isotope masses and their percent abundances.",
  inputs: [
    {
      description: "Isotope masses in atomic mass units.",
      id: "isotopeMassesU",
      label: "Isotope masses",
      kind: "numberList",
      unit: "u",
    },
    {
      description: "Percent abundance of each isotope.",
      id: "abundancesPercent",
      label: "Abundances",
      kind: "numberList",
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Weighted-average atomic mass.",
      id: "averageMassU",
      label: "Average mass",
      kind: "number",
      unit: "u",
    },
  ],
  calculate: (input) => {
    const masses = input.isotopeMassesU as number[];
    const abundances = input.abundancesPercent as number[];
    if (masses.length !== abundances.length || masses.length === 0)
      simpleError(
        "abundancesPercent",
        "Provide matching non-empty mass and abundance lists.",
        "invalid_lengths",
      );
    const totalAbundance = abundances.reduce((sum, value) => sum + value, 0);
    if (
      masses.some((mass) => !(mass > 0)) ||
      abundances.some((abundance) => abundance < 0) ||
      !(totalAbundance > 0)
    )
      simpleError(
        "abundancesPercent",
        "Masses must be positive and abundances must be nonnegative with a positive total.",
        "invalid_values",
      );
    const weightedSum = masses.reduce(
      (sum, mass, index) => sum + mass * (abundances[index] as number),
      0,
    );
    return { averageMassU: weightedSum / totalAbundance };
  },
});
export const runIsotopeAverageMass = isotopeAverageMassTool.execute;
export default isotopeAverageMassTool;

export type IsotopeAverageMassInput = {
  readonly isotopeMassesU: readonly number[];
  readonly abundancesPercent: readonly number[];
};

export type IsotopeAverageMassOutput = {
  readonly averageMassU: number;
};

export const isotopeAverageMassExample = {
  input: {
    isotopeMassesU: [1],
    abundancesPercent: [1],
  },
  output: {
    averageMassU: 1,
  },
} satisfies ToolExample<IsotopeAverageMassInput, IsotopeAverageMassOutput>;
