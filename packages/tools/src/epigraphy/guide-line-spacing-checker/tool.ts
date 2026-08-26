import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GuideLineSpacingCheckerInput = {
  readonly spacingListMm: readonly number[];
  readonly tolerancePercent?: number;
};

export type GuideLineSpacingCheckerOutput = {
  readonly lineCount: number;
  readonly meanSpacingMm: number;
  readonly minSpacingMm: number;
  readonly maxSpacingMm: number;
  readonly uniformSpacing: boolean;
};

export const calculateGuideLineSpacingChecker = (
  input: GuideLineSpacingCheckerInput,
): GuideLineSpacingCheckerOutput => {
  if (input.spacingListMm.length === 0)
    return simpleError(
      "spacingListMm",
      "At least one measured spacing is required.",
      "invalid_spacing",
    );
  const tolerance = input.tolerancePercent ?? 10;
  if (!(tolerance >= 0))
    return simpleError(
      "tolerancePercent",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  for (const spacing of input.spacingListMm)
    if (!(spacing > 0))
      return simpleError(
        "spacingListMm",
        "Measured spacings must be greater than zero.",
        "invalid_spacing",
      );
  const lineCount = input.spacingListMm.length;
  const total = input.spacingListMm.reduce((sum, s) => sum + s, 0);
  const meanSpacingMm = total / lineCount;
  const minSpacingMm = Math.min(...input.spacingListMm);
  const maxSpacingMm = Math.max(...input.spacingListMm);
  const uniformSpacing = input.spacingListMm.every(
    (s) => Math.abs(s - meanSpacingMm) <= (meanSpacingMm * tolerance) / 100,
  );
  return {
    lineCount,
    meanSpacingMm,
    minSpacingMm,
    maxSpacingMm,
    uniformSpacing,
  };
};

export const guideLineSpacingCheckerExample = {
  input: { spacingListMm: [30, 31, 29], tolerancePercent: 10 },
  output: {
    lineCount: 3,
    meanSpacingMm: 30,
    minSpacingMm: 29,
    maxSpacingMm: 31,
    uniformSpacing: true,
  },
} satisfies ToolExample<
  GuideLineSpacingCheckerInput,
  GuideLineSpacingCheckerOutput
>;

export const guideLineSpacingCheckerTool = createSimpleTool({
  id: "epigraphy/guide-line-spacing-checker",
  title: "Guide Line Incision Presence Grid Spacing Checker",
  description:
    "Check whether measured guide-line incision spacings form a regular grid by comparing each spacing against the mean within a percentage tolerance.",
  inputs: [
    {
      description: "Measured successive guide-line spacings in millimetres.",
      id: "spacingListMm",
      kind: "numberList",
      label: "Spacings",
    },
    {
      default: 10,
      description:
        "Allowed deviation of any spacing from the mean, in percent.",
      id: "tolerancePercent",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Number of measured spacings.",
      id: "lineCount",
      kind: "integer",
      label: "Count",
    },
    {
      description: "Mean spacing in millimetres.",
      id: "meanSpacingMm",
      kind: "number",
      label: "Mean",
    },
    {
      description: "Smallest measured spacing in millimetres.",
      id: "minSpacingMm",
      kind: "number",
      label: "Minimum",
    },
    {
      description: "Largest measured spacing in millimetres.",
      id: "maxSpacingMm",
      kind: "number",
      label: "Maximum",
    },
    {
      description: "Whether every spacing lies within tolerance of the mean.",
      id: "uniformSpacing",
      kind: "boolean",
      label: "Uniform",
    },
  ],
  calculate: (input) =>
    calculateGuideLineSpacingChecker(
      input as unknown as GuideLineSpacingCheckerInput,
    ),
});

export const runGuideLineSpacingChecker = guideLineSpacingCheckerTool.execute;
export default guideLineSpacingCheckerTool;
