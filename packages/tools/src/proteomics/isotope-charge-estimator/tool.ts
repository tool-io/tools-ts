import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly isotopeSpacingMz: number;
  readonly isotopeMassDifferenceDa: number;
  readonly maxCharge: number;
  readonly spacingToleranceMz: number;
}>;
export type Output = Readonly<{
  readonly estimatedCharge: number;
  readonly predictedSpacingMz: number;
  readonly withinTolerance: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.isotopeSpacingMz <= 0 ||
    input.isotopeMassDifferenceDa <= 0 ||
    !Number.isSafeInteger(input.maxCharge) ||
    input.maxCharge < 1 ||
    input.spacingToleranceMz < 0
  )
    simpleError(
      "isotopeSpacingMz",
      "Positive isotope spacing, mass difference, and charge range required.",
    );
  let estimatedCharge = 1;
  for (let z = 2; z <= input.maxCharge; z++)
    if (
      Math.abs(input.isotopeSpacingMz - input.isotopeMassDifferenceDa / z) <
      Math.abs(
        input.isotopeSpacingMz -
          input.isotopeMassDifferenceDa / estimatedCharge,
      )
    )
      estimatedCharge = z;
  const predictedSpacingMz = input.isotopeMassDifferenceDa / estimatedCharge;
  return {
    estimatedCharge,
    predictedSpacingMz,
    withinTolerance:
      Math.abs(input.isotopeSpacingMz - predictedSpacingMz) <=
      input.spacingToleranceMz,
  };
};
export const exampleInput = {
  isotopeSpacingMz: 0.5016775,
  isotopeMassDifferenceDa: 1.003355,
  maxCharge: 5,
  spacingToleranceMz: 0.01,
} satisfies Input;
export const exampleOutput = {
  estimatedCharge: 2,
  predictedSpacingMz: 0.5016775,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/isotope-charge-estimator",
  title: "Isotope Charge Estimator",
  description:
    "Infer peptide charge from measured isotope spacing and supplied isotope mass.",
  inputs: [
    { id: "isotopeSpacingMz", label: "Isotope spacing mz", kind: "number" },
    {
      id: "isotopeMassDifferenceDa",
      label: "Isotope mass difference da",
      kind: "number",
    },
    { id: "maxCharge", label: "Max charge", kind: "number" },
    { id: "spacingToleranceMz", label: "Spacing tolerance mz", kind: "number" },
  ],
  outputs: [
    { id: "estimatedCharge", label: "Estimated charge", kind: "number" },
    { id: "predictedSpacingMz", label: "Predicted spacing mz", kind: "number" },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      isotopeSpacingMz: value.isotopeSpacingMz as number,
      isotopeMassDifferenceDa: value.isotopeMassDifferenceDa as number,
      maxCharge: value.maxCharge as number,
      spacingToleranceMz: value.spacingToleranceMz as number,
    }),
});
export const run = tool.execute;
export default tool;
