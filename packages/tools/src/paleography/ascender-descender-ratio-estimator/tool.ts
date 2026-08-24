import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AscenderDescenderRatioEstimatorInput = {
  readonly meanAscenderHeightMm: number;
  readonly meanDescenderHeightMm: number;
};

export type AscenderDescenderRatioEstimatorOutput = {
  readonly ascenderToDescenderRatio: number;
  readonly profileBand: "ascender_dominant" | "balanced" | "descender_dominant";
};

export const calculateAscenderDescenderRatioEstimator = (
  input: AscenderDescenderRatioEstimatorInput,
): AscenderDescenderRatioEstimatorOutput => {
  if (!(
    Number.isFinite(input.meanAscenderHeightMm) &&
    input.meanAscenderHeightMm > 0
  ))
    return simpleError(
      "meanAscenderHeightMm",
      "Ascender height must be greater than zero millimetres.",
      "invalid_height",
    );
  if (!(
    Number.isFinite(input.meanDescenderHeightMm) &&
    input.meanDescenderHeightMm > 0
  ))
    return simpleError(
      "meanDescenderHeightMm",
      "Descender height must be greater than zero millimetres.",
      "invalid_height",
    );
  const ratio = input.meanAscenderHeightMm / input.meanDescenderHeightMm;
  if (!(Number.isFinite(ratio) && ratio > 0))
    return simpleError(
      "meanDescenderHeightMm",
      "The height ratio is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    ascenderToDescenderRatio: ratio,
    profileBand:
      ratio >= 1.25
        ? "ascender_dominant"
        : ratio <= 0.8
          ? "descender_dominant"
          : "balanced",
  };
};

export const ascenderDescenderRatioEstimatorExample = {
  input: { meanAscenderHeightMm: 3, meanDescenderHeightMm: 2.5 },
  output: { ascenderToDescenderRatio: 1.2, profileBand: "balanced" },
} satisfies ToolExample<
  AscenderDescenderRatioEstimatorInput,
  AscenderDescenderRatioEstimatorOutput
>;

export const ascenderDescenderRatioEstimatorTool = createSimpleTool({
  id: "paleography/ascender-descender-ratio-estimator",
  title: "Ascender/Descender Ratio Estimator",
  description:
    "Estimate the vertical profile of a hand as mean ascender height over mean descender height, banded by the stated rule: ascender-dominant at 1.25 and above (typical of formal Gothic textualis), descender-dominant at 0.8 and below (typical of cursives), otherwise balanced.",
  inputs: [
    {
      description: "Mean ascender height above the headline in mm.",
      id: "meanAscenderHeightMm",
      kind: "number",
      label: "Ascender height",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      description: "Mean descender depth below the baseline in mm.",
      id: "meanDescenderHeightMm",
      kind: "number",
      label: "Descender depth",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Ascender height divided by descender depth.",
      id: "ascenderToDescenderRatio",
      kind: "number",
      label: "A/D ratio",
    },
    {
      description: "Profile band from the stated cut-offs.",
      id: "profileBand",
      enum: ["ascender_dominant", "balanced", "descender_dominant"],
      kind: "string",
      label: "Profile band",
    },
  ],
  calculate: (input) =>
    calculateAscenderDescenderRatioEstimator({
      meanAscenderHeightMm: input.meanAscenderHeightMm as number,
      meanDescenderHeightMm: input.meanDescenderHeightMm as number,
    }),
});

export const runAscenderDescenderRatioEstimator =
  ascenderDescenderRatioEstimatorTool.execute;
export default ascenderDescenderRatioEstimatorTool;
