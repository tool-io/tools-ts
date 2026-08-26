import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FragmentJoinConfidenceScorerInput = {
  readonly profileAgreementPercent: number;
  readonly thicknessDifferenceMm: number;
  readonly maxThicknessToleranceMm?: number;
};

export type FragmentJoinConfidenceScorerOutput = {
  readonly thicknessSimilarityPercent: number;
  readonly joinConfidencePercent: number;
};

export const calculateFragmentJoinConfidenceScorer = (
  input: FragmentJoinConfidenceScorerInput,
): FragmentJoinConfidenceScorerOutput => {
  if (!(
    input.profileAgreementPercent >= 0 && input.profileAgreementPercent <= 100
  ))
    return simpleError(
      "profileAgreementPercent",
      "Profile agreement must be between 0 and 100 percent.",
      "invalid_profile",
    );
  if (!(input.thicknessDifferenceMm >= 0))
    return simpleError(
      "thicknessDifferenceMm",
      "Thickness difference must be non-negative.",
      "invalid_thickness",
    );
  const tolerance = input.maxThicknessToleranceMm ?? 5;
  if (!(tolerance > 0))
    return simpleError(
      "maxThicknessToleranceMm",
      "Thickness tolerance must be greater than zero.",
      "invalid_tolerance",
    );
  const thicknessSimilarityPercent = Math.max(
    0,
    100 * (1 - input.thicknessDifferenceMm / tolerance),
  );
  return {
    thicknessSimilarityPercent,
    joinConfidencePercent:
      (input.profileAgreementPercent + thicknessSimilarityPercent) / 2,
  };
};

export const fragmentJoinConfidenceScorerExample = {
  input: {
    profileAgreementPercent: 80,
    thicknessDifferenceMm: 1,
    maxThicknessToleranceMm: 5,
  },
  output: { thicknessSimilarityPercent: 80, joinConfidencePercent: 80 },
} satisfies ToolExample<
  FragmentJoinConfidenceScorerInput,
  FragmentJoinConfidenceScorerOutput
>;

export const fragmentJoinConfidenceScorerTool = createSimpleTool({
  id: "epigraphy/fragment-join-confidence-scorer",
  title: "Fragment Join Confidence Edge Profile Scorer",
  description:
    "Score the confidence of a fragment join as the average of edge-profile agreement and a thickness similarity derived from the measured difference and a maximum tolerance.",
  inputs: [
    {
      description: "Agreement of the fracture edge profiles, in percent.",
      id: "profileAgreementPercent",
      kind: "number",
      label: "Profile agreement",
      maximum: 100,
      minimum: 0,
    },
    {
      description:
        "Absolute thickness difference across the join, in millimetres.",
      id: "thicknessDifferenceMm",
      kind: "number",
      label: "Thickness difference",
      minimum: 0,
    },
    {
      default: 5,
      description:
        "Thickness difference at which similarity reaches zero, in millimetres.",
      id: "maxThicknessToleranceMm",
      kind: "number",
      label: "Tolerance",
    },
  ],
  outputs: [
    {
      description: "Thickness similarity contribution in percent.",
      id: "thicknessSimilarityPercent",
      kind: "number",
      label: "Thickness similarity",
    },
    {
      description: "Overall join confidence in percent.",
      id: "joinConfidencePercent",
      kind: "number",
      label: "Join confidence",
    },
  ],
  calculate: (input) =>
    calculateFragmentJoinConfidenceScorer(
      input as unknown as FragmentJoinConfidenceScorerInput,
    ),
});

export const runFragmentJoinConfidenceScorer =
  fragmentJoinConfidenceScorerTool.execute;
export default fragmentJoinConfidenceScorerTool;
