import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReplacementFertilityWithMortalityCheckerInput = {
  readonly femaleSurvivalToReproductiveAge: number;
  readonly femaleBirthShare?: number;
  readonly observedTfr?: number;
  readonly tolerance?: number;
};

export type ReplacementFertilityWithMortalityCheckerOutput = {
  readonly replacementTfr: number;
  readonly status: "belowReplacement" | "atReplacement" | "aboveReplacement";
};

export const calculateReplacementFertilityWithMortalityChecker = (
  input: ReplacementFertilityWithMortalityCheckerInput,
): ReplacementFertilityWithMortalityCheckerOutput => {
  const share = input.femaleBirthShare ?? 0.4878;
  const observed = input.observedTfr ?? 2.1;
  const tolerance = input.tolerance ?? 0.05;
  if (!(
    input.femaleSurvivalToReproductiveAge > 0 &&
    input.femaleSurvivalToReproductiveAge <= 1
  ))
    simpleError(
      "femaleSurvivalToReproductiveAge",
      "Survival to the mean age of childbearing must lie between zero (exclusive) and one.",
      "invalid_survival",
    );
  if (!(share > 0 && share <= 1))
    simpleError(
      "femaleBirthShare",
      "The female share of births must lie in (0, 1].",
      "invalid_share",
    );
  if (!(observed >= 0))
    simpleError(
      "observedTfr",
      "The observed TFR must be non-negative.",
      "invalid_tfr",
    );
  if (!(tolerance >= 0))
    simpleError(
      "tolerance",
      "The tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const replacementTfr = 1 / (share * input.femaleSurvivalToReproductiveAge);
  const gap = observed - replacementTfr;
  return {
    replacementTfr,
    status:
      Math.abs(gap) <= tolerance
        ? "atReplacement"
        : gap < 0
          ? "belowReplacement"
          : "aboveReplacement",
  };
};

export const replacementFertilityWithMortalityCheckerExample = {
  input: {
    femaleSurvivalToReproductiveAge: 0.94,
    femaleBirthShare: 0.4878,
    observedTfr: 2.1,
    tolerance: 0.05,
  },
  output: { replacementTfr: 2.180872872558513, status: "belowReplacement" },
} satisfies ToolExample<
  ReplacementFertilityWithMortalityCheckerInput,
  ReplacementFertilityWithMortalityCheckerOutput
>;

export const replacementFertilityWithMortalityCheckerTool = createSimpleTool({
  id: "demography/replacement-fertility-with-mortality-checker",
  title: "Replacement Fertility With Mortality Checker",
  description:
    "Compute the replacement total fertility rate as the reciprocal of the product of the female birth share and female survival to the reproductive ages, then classify an observed TFR against it within a stated tolerance.",
  inputs: [
    {
      description:
        "Probability a female newborn survives to the mean age of childbearing.",
      id: "femaleSurvivalToReproductiveAge",
      kind: "number",
      label: "Survival",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 0.4878,
      description:
        "Female share of births, conventionally 100/205 for a sex ratio at birth of 105.",
      id: "femaleBirthShare",
      kind: "number",
      label: "Female share",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 2.1,
      description: "Observed TFR to compare against replacement.",
      id: "observedTfr",
      kind: "number",
      label: "Observed TFR",
      minimum: 0,
    },
    {
      default: 0.05,
      description: "Absolute band treated as being at replacement.",
      id: "tolerance",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Replacement-level total fertility rate under current mortality.",
      id: "replacementTfr",
      kind: "number",
      label: "Replacement TFR",
    },
    {
      description: "Comparison of the observed TFR with replacement.",
      enum: ["belowReplacement", "atReplacement", "aboveReplacement"],
      id: "status",
      kind: "string",
      label: "Status",
    },
  ],
  calculate: (input) =>
    calculateReplacementFertilityWithMortalityChecker(
      input as unknown as ReplacementFertilityWithMortalityCheckerInput,
    ),
});

export const runReplacementFertilityWithMortalityChecker =
  replacementFertilityWithMortalityCheckerTool.execute;
export default replacementFertilityWithMortalityCheckerTool;
