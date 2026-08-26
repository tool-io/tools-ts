import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SecondTransitionFeaturesCheckerInput = {
  readonly fertilityBelowReplacement?: boolean;
  readonly parenthoodPostponement?: boolean;
  readonly unionInstabilityRise?: boolean;
  readonly householdDiversification?: boolean;
};

export type SecondTransitionFeaturesCheckerOutput = {
  readonly matchedMarkers: number;
  readonly sdtProfile: "no-sdt-marker" | "partial-sdt" | "full-sdt";
};

export const calculateSecondTransitionFeaturesChecker = (
  input: SecondTransitionFeaturesCheckerInput,
): SecondTransitionFeaturesCheckerOutput => {
  const markers = [
    input.fertilityBelowReplacement ?? false,
    input.parenthoodPostponement ?? false,
    input.unionInstabilityRise ?? false,
    input.householdDiversification ?? false,
  ];
  const matchedMarkers = markers.filter((marker) => marker).length;
  const sdtProfile =
    matchedMarkers >= 4
      ? "full-sdt"
      : matchedMarkers >= 2
        ? "partial-sdt"
        : "no-sdt-marker";
  return { matchedMarkers, sdtProfile };
};

export const secondTransitionFeaturesCheckerExample = {
  input: {
    fertilityBelowReplacement: true,
    parenthoodPostponement: true,
    unionInstabilityRise: true,
  },
  output: { matchedMarkers: 3, sdtProfile: "partial-sdt" },
} satisfies ToolExample<
  SecondTransitionFeaturesCheckerInput,
  SecondTransitionFeaturesCheckerOutput
>;

export const secondTransitionFeaturesCheckerTool = createSimpleTool({
  id: "demography/second-transition-features-checker",
  title: "Second Transition Features Checker",
  description:
    "Count which of the four classic second-demographic-transition markers are present (below-replacement fertility, postponed parenthood, rising union instability or cohabitation, household diversification) and label the profile full at four markers, partial at two or three, absent otherwise.",
  inputs: [
    {
      default: false,
      description:
        "Period fertility is persistently below replacement (about 2.1 children per woman).",
      id: "fertilityBelowReplacement",
      kind: "boolean",
      label: "Sub-replacement TFR",
    },
    {
      default: false,
      description: "Mean age at motherhood and at first union is rising.",
      id: "parenthoodPostponement",
      kind: "boolean",
      label: "Postponement",
    },
    {
      default: false,
      description: "Divorce and consensual unions are rising markedly.",
      id: "unionInstabilityRise",
      kind: "boolean",
      label: "Union instability",
    },
    {
      default: false,
      description:
        "Living arrangements have diversified beyond the married-couple household with children.",
      id: "householdDiversification",
      kind: "boolean",
      label: "Household diversity",
    },
  ],
  outputs: [
    {
      description: "Number of SDT markers present.",
      id: "matchedMarkers",
      kind: "number",
      label: "Markers",
    },
    {
      description: "Overall second-transition profile label.",
      enum: ["no-sdt-marker", "partial-sdt", "full-sdt"],
      id: "sdtProfile",
      kind: "string",
      label: "Profile",
    },
  ],
  calculate: (input) =>
    calculateSecondTransitionFeaturesChecker(
      input as unknown as SecondTransitionFeaturesCheckerInput,
    ),
});

export const runSecondTransitionFeaturesChecker =
  secondTransitionFeaturesCheckerTool.execute;
export default secondTransitionFeaturesCheckerTool;
