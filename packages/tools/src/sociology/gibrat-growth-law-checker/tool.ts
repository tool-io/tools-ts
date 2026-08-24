import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GibratGrowthLawCheckerInput = {
  readonly largeGroupGrowthPercent: number;
  readonly smallGroupGrowthPercent: number;
  readonly tolerancePercent?: number;
};

export type GibratGrowthLawCheckerOutput = {
  readonly proportionalGrowth: boolean;
  readonly growthGapPercent: number;
};

export const gibratGrowthLawCheckerExample = {
  input: {
    largeGroupGrowthPercent: 2,
    smallGroupGrowthPercent: 2.4,
    tolerancePercent: 1,
  },
  output: {
    growthGapPercent: 0.3999999999999999,
    proportionalGrowth: true,
  },
} satisfies ToolExample<
  GibratGrowthLawCheckerInput,
  GibratGrowthLawCheckerOutput
>;

export const calculateGibratGrowthLaw = (
  input: GibratGrowthLawCheckerInput,
): GibratGrowthLawCheckerOutput => {
  const tolerance = input.tolerancePercent ?? 1;
  if (
    !Number.isFinite(input.largeGroupGrowthPercent) ||
    !Number.isFinite(input.smallGroupGrowthPercent)
  )
    simpleError(
      "largeGroupGrowthPercent",
      "Both group growth rates must be finite numbers.",
      "invalid_value",
    );
  if (!Number.isFinite(tolerance) || tolerance < 0)
    simpleError(
      "tolerancePercent",
      "The tolerance cannot be negative.",
      "invalid_value",
    );
  const gap = Math.abs(
    input.smallGroupGrowthPercent - input.largeGroupGrowthPercent,
  );
  if (!Number.isFinite(gap))
    simpleError(
      "smallGroupGrowthPercent",
      "The growth-rate gap is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    growthGapPercent: gap,
    proportionalGrowth: gap <= tolerance,
  };
};

export const gibratGrowthLawCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateGibratGrowthLaw({
      largeGroupGrowthPercent: input.largeGroupGrowthPercent as number,
      smallGroupGrowthPercent: input.smallGroupGrowthPercent as number,
      tolerancePercent: input.tolerancePercent as number,
    }),
  description:
    "Test Gibrat's law of proportional growth by comparing average growth rates of large and small units against a tolerance.",
  id: "sociology/gibrat-growth-law-checker",
  inputs: [
    {
      description: "Mean growth rate of the large-unit group.",
      id: "largeGroupGrowthPercent",
      kind: "number",
      label: "Large group growth",
      unit: "%",
    },
    {
      description: "Mean growth rate of the small-unit group.",
      id: "smallGroupGrowthPercent",
      kind: "number",
      label: "Small group growth",
      unit: "%",
    },
    {
      default: 1,
      description:
        "Largest percentage-point gap still counted as proportionate growth.",
      id: "tolerancePercent",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Absolute difference between the two growth rates.",
      id: "growthGapPercent",
      kind: "number",
      label: "Growth gap",
      unit: "%",
    },
    {
      description: "Whether the rates match within the tolerance.",
      id: "proportionalGrowth",
      kind: "boolean",
      label: "Proportional growth",
    },
  ],
  title: "Gibrat Growth Law Checker",
});
export const runGibratGrowthLawChecker = gibratGrowthLawCheckerTool.execute;
export default gibratGrowthLawCheckerTool;
