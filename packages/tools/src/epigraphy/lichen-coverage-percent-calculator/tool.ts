import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LichenCoveragePercentCalculatorInput = {
  readonly coveredAreaCm2: number;
  readonly totalAreaCm2: number;
};

export type LichenCoveragePercentCalculatorOutput = {
  readonly coveragePercent: number;
  readonly colonizationFraction: number;
};

export const calculateLichenCoveragePercentCalculator = (
  input: LichenCoveragePercentCalculatorInput,
): LichenCoveragePercentCalculatorOutput => {
  if (!(input.totalAreaCm2 > 0))
    return simpleError(
      "totalAreaCm2",
      "Total sampled area must be greater than zero.",
      "invalid_area",
    );
  if (!(input.coveredAreaCm2 >= 0))
    return simpleError(
      "coveredAreaCm2",
      "Covered area must be non-negative.",
      "invalid_area",
    );
  if (input.coveredAreaCm2 > input.totalAreaCm2)
    return simpleError(
      "coveredAreaCm2",
      "Covered area cannot exceed the total sampled area.",
      "invalid_area",
    );
  return {
    coveragePercent: (input.coveredAreaCm2 / input.totalAreaCm2) * 100,
    colonizationFraction: input.coveredAreaCm2 / input.totalAreaCm2,
  };
};

export const lichenCoveragePercentCalculatorExample = {
  input: { coveredAreaCm2: 125, totalAreaCm2: 1000 },
  output: { coveragePercent: 12.5, colonizationFraction: 0.125 },
} satisfies ToolExample<
  LichenCoveragePercentCalculatorInput,
  LichenCoveragePercentCalculatorOutput
>;

export const lichenCoveragePercentCalculatorTool = createSimpleTool({
  id: "epigraphy/lichen-coverage-percent-calculator",
  title: "Lichen Coverage Percent Colonization Rate Calculator",
  description:
    "Compute the lichen colonization rate of an inscription surface as a percentage and fraction from the covered and total sampled areas.",
  inputs: [
    {
      description: "Surface area colonized by lichen in square centimetres.",
      id: "coveredAreaCm2",
      kind: "number",
      label: "Covered area",
      minimum: 0,
      unit: "cm²",
    },
    {
      description: "Total sampled surface area in square centimetres.",
      id: "totalAreaCm2",
      kind: "number",
      label: "Total area",
      minimum: 0,
      unit: "cm²",
    },
  ],
  outputs: [
    {
      description: "Colonized share of the sample in percent.",
      id: "coveragePercent",
      kind: "number",
      label: "Coverage",
    },
    {
      description: "Colonized share as a fraction of one.",
      id: "colonizationFraction",
      kind: "number",
      label: "Fraction",
    },
  ],
  calculate: (input) =>
    calculateLichenCoveragePercentCalculator(
      input as unknown as LichenCoveragePercentCalculatorInput,
    ),
});

export const runLichenCoveragePercentCalculator =
  lichenCoveragePercentCalculatorTool.execute;
export default lichenCoveragePercentCalculatorTool;
