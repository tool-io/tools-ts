import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Brett4epRiskCheckerInput = {
  readonly fourEpUgL: number;
  readonly highThresholdUgL: number;
  readonly noticeableThresholdUgL: number;
};

export type Brett4epRiskCheckerOutput = {
  readonly riskLevel: string;
};

export const brett4epRiskCheckerExample = {
  input: {
    fourEpUgL: 300,
    highThresholdUgL: 625,
    noticeableThresholdUgL: 425,
  },
  output: {
    riskLevel: "low",
  },
} satisfies ToolExample<Brett4epRiskCheckerInput, Brett4epRiskCheckerOutput>;

export const calculateBrett4epRisk = (
  input: Brett4epRiskCheckerInput,
): Brett4epRiskCheckerOutput => {
  if (input.fourEpUgL < 0)
    simpleError(
      "fourEpUgL",
      "The 4-EP concentration cannot be negative.",
      "invalid_value",
    );
  if (input.highThresholdUgL <= input.noticeableThresholdUgL)
    simpleError(
      "highThresholdUgL",
      "The high threshold must exceed the noticeable threshold.",
      "invalid_value",
    );
  return {
    riskLevel:
      input.fourEpUgL >= input.highThresholdUgL
        ? "high"
        : input.fourEpUgL >= input.noticeableThresholdUgL
          ? "noticeable"
          : "low",
  };
};

export const brett4epRiskCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateBrett4epRisk(input as unknown as Brett4epRiskCheckerInput),
  description:
    "Classify measured 4-ethylphenol against caller-supplied noticeable and high thresholds; sensory response varies with wine matrix, other volatile phenols, and the assessor.",
  id: "oenology/brett-4ep-risk-checker",
  inputs: [
    {
      description: "Concentration at or above which the result is high.",
      id: "highThresholdUgL",
      kind: "number",
      label: "High threshold",
      minimum: 0,
      unit: "µg/L",
    },
    {
      description: "Concentration at or above which the result is noticeable.",
      id: "noticeableThresholdUgL",
      kind: "number",
      label: "Noticeable threshold",
      minimum: 0,
      unit: "µg/L",
    },
    {
      description: "4-ethylphenol measured in the wine.",
      id: "fourEpUgL",
      kind: "number",
      label: "4-EP",
      minimum: 0,
      unit: "µg/L",
    },
  ],
  outputs: [
    {
      description: "One of low, noticeable, or high.",
      id: "riskLevel",
      kind: "string",
      label: "Risk level",
    },
  ],
  title: "Brettanomyces 4-EP Risk Checker",
});
export const runBrett4epRiskChecker = brett4epRiskCheckerTool.execute;
export default brett4epRiskCheckerTool;
