import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmaraLawInput = {
  readonly longTermOutcome: number;
  readonly shortTermPrediction: number;
};

export type AmaraLawOutput = {
  readonly overestimated: boolean;
  readonly overstatementPercent: number;
  readonly predictionToOutcomeRatio: number;
};

export const calculateAmaraLawOverstatement = (
  input: AmaraLawInput,
): AmaraLawOutput => {
  if (!Number.isFinite(input.longTermOutcome) || input.longTermOutcome <= 0)
    simpleError(
      "longTermOutcome",
      "Long-term outcome must be finite and greater than zero.",
      "invalid_long_term_outcome",
    );
  if (
    !Number.isFinite(input.shortTermPrediction) ||
    input.shortTermPrediction < 0
  )
    simpleError(
      "shortTermPrediction",
      "Short-term prediction must be finite and nonnegative.",
      "invalid_short_term_prediction",
    );
  const overstatementPercent =
    ((input.shortTermPrediction - input.longTermOutcome) /
      input.longTermOutcome) *
    100;
  const predictionToOutcomeRatio =
    input.shortTermPrediction / input.longTermOutcome;
  if (
    !Number.isFinite(overstatementPercent) ||
    !Number.isFinite(predictionToOutcomeRatio)
  )
    simpleError("", "The Amara comparison is not finite.", "result_not_finite");
  return {
    overestimated: overstatementPercent > 0,
    overstatementPercent,
    predictionToOutcomeRatio,
  };
};

export const amaraLawExample = {
  input: { longTermOutcome: 40, shortTermPrediction: 100 },
  output: {
    overestimated: true,
    overstatementPercent: 150,
    predictionToOutcomeRatio: 2.5,
  },
} satisfies ToolExample<AmaraLawInput, AmaraLawOutput>;

export const amaraLawTool = createSimpleTool({
  calculate: (input) =>
    calculateAmaraLawOverstatement({
      longTermOutcome: input.longTermOutcome as number,
      shortTermPrediction: input.shortTermPrediction as number,
    }),
  description:
    "Quantify how much a short-term prediction exceeds a later outcome and report the prediction-to-outcome ratio.",
  id: "futurology/amara-law-short-run-overestimate-rule-lookup",
  inputs: [
    {
      id: "longTermOutcome",
      kind: "number",
      label: "Long-term outcome",
      minimum: 0,
    },
    {
      id: "shortTermPrediction",
      kind: "number",
      label: "Short-term prediction",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "overestimated", kind: "boolean", label: "Prediction overestimated" },
    {
      id: "overstatementPercent",
      kind: "number",
      label: "Overstatement percent",
      unit: "%",
    },
    {
      id: "predictionToOutcomeRatio",
      kind: "number",
      label: "Prediction-to-outcome ratio",
      minimum: 0,
    },
  ],
  title: "Amara Law Short Run Overestimate Rule Lookup",
});

export const runAmaraLaw = amaraLawTool.execute;
export default amaraLawTool;
