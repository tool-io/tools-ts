import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbcAnalysisCumulativeValueClassifierInput = {
  readonly cumulativeValueSharePercent: number;
};

export type AbcAnalysisCumulativeValueClassifierOutput = {
  readonly abcClass: "A" | "B" | "C";
};

export const calculateAbcAnalysisCumulativeValueClassifier = (
  input: AbcAnalysisCumulativeValueClassifierInput,
): AbcAnalysisCumulativeValueClassifierOutput => {
  const share = input.cumulativeValueSharePercent;
  if (!(Number.isFinite(share) && share >= 0 && share <= 100))
    return simpleError(
      "cumulativeValueSharePercent",
      "Cumulative value share must be between zero and one hundred.",
      "invalid_share",
    );
  const abcClass = share <= 80 ? "A" : share <= 95 ? "B" : "C";
  return { abcClass };
};

export const abcAnalysisCumulativeValueClassifierExample = {
  input: { cumulativeValueSharePercent: 78 },
  output: { abcClass: "A" },
} satisfies ToolExample<
  AbcAnalysisCumulativeValueClassifierInput,
  AbcAnalysisCumulativeValueClassifierOutput
>;

export const abcAnalysisCumulativeValueClassifierTool = createSimpleTool({
  id: "logistics/abc-analysis-cumulative-value-classifier",
  title: "ABC Analysis Cumulative Value Classifier",
  description:
    "Classify an item by cumulative annual-usage-value share using fixed policy thresholds: A from 0% through 80%, B above 80% through 95%, and C above 95% through 100%.",
  inputs: [
    {
      description:
        "Cumulative percent of total annual usage value after items have been ranked from highest to lowest annual usage value.",
      id: "cumulativeValueSharePercent",
      kind: "number",
      label: "Cumulative value share",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "ABC class assigned by the fixed 80% and 95% boundaries.",
      enum: ["A", "B", "C"],
      id: "abcClass",
      kind: "string",
      label: "ABC class",
    },
  ],
  calculate: (input) =>
    calculateAbcAnalysisCumulativeValueClassifier({
      cumulativeValueSharePercent: input.cumulativeValueSharePercent as number,
    }),
});

export const runAbcAnalysisCumulativeValueClassifier =
  abcAnalysisCumulativeValueClassifierTool.execute;
export default abcAnalysisCumulativeValueClassifierTool;
