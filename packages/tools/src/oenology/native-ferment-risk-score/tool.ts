import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type NativeFermentRiskScoreInput = {
  readonly freeSo2AtCrushMgPerL: number;
  readonly highRiskThreshold: number;
  readonly moderateRiskThreshold: number;
  readonly mustTemperatureC: number;
  readonly so2BaselineMgPerL: number;
  readonly temperatureBaselineC: number;
  readonly temperatureWeightPerDegree: number;
};

export type NativeFermentRiskScoreOutput = {
  readonly riskLevel: string;
  readonly riskScore: number;
};

export const nativeFermentRiskScoreExample = {
  input: {
    freeSo2AtCrushMgPerL: 30,
    highRiskThreshold: 50,
    moderateRiskThreshold: 20,
    mustTemperatureC: 12,
    so2BaselineMgPerL: 10,
    temperatureBaselineC: 15,
    temperatureWeightPerDegree: 2,
  },
  output: {
    riskLevel: "moderate",
    riskScore: 26,
  },
} satisfies ToolExample<
  NativeFermentRiskScoreInput,
  NativeFermentRiskScoreOutput
>;

export const calculateNativeFermentRiskScore = (
  input: NativeFermentRiskScoreInput,
): NativeFermentRiskScoreOutput => {
  if (input.highRiskThreshold <= input.moderateRiskThreshold)
    simpleError(
      "highRiskThreshold",
      "The high-risk threshold must exceed the moderate-risk threshold.",
      "invalid_value",
    );
  const score =
    Math.max(0, input.freeSo2AtCrushMgPerL - input.so2BaselineMgPerL) +
    Math.max(0, input.temperatureBaselineC - input.mustTemperatureC) *
      input.temperatureWeightPerDegree;
  const rounded = roundStatistic(score);
  return {
    riskLevel:
      score >= input.highRiskThreshold
        ? "high"
        : score >= input.moderateRiskThreshold
          ? "moderate"
          : "low",
    riskScore: rounded,
  };
};

export const nativeFermentRiskScoreTool = createSimpleTool({
  calculate: (input) =>
    calculateNativeFermentRiskScore(
      input as unknown as NativeFermentRiskScoreInput,
    ),
  description:
    "Apply a caller-defined linear scoring model to free SO2 above a baseline and temperature below a baseline; this configurable heuristic is not a microbiological prediction.",
  id: "oenology/native-ferment-risk-score",
  inputs: [
    {
      description: "Free SO2 measured at crush.",
      id: "freeSo2AtCrushMgPerL",
      kind: "number",
      label: "Free SO2 at crush",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Score at or above which the high category begins.",
      id: "highRiskThreshold",
      kind: "number",
      label: "High threshold",
      minimum: 0,
    },
    {
      description: "Score at or above which the moderate category begins.",
      id: "moderateRiskThreshold",
      kind: "number",
      label: "Moderate threshold",
      minimum: 0,
    },
    {
      description: "Must temperature measured at crush.",
      id: "mustTemperatureC",
      kind: "number",
      label: "Must temperature",
      unit: "°C",
    },
    {
      description: "Free SO2 below which this model adds no SO2 score.",
      id: "so2BaselineMgPerL",
      kind: "number",
      label: "SO2 baseline",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description:
        "Temperature above which this model adds no temperature score.",
      id: "temperatureBaselineC",
      kind: "number",
      label: "Temperature baseline",
      unit: "°C",
    },
    {
      description: "Score points assigned per degree below the baseline.",
      id: "temperatureWeightPerDegree",
      kind: "number",
      label: "Temperature weight",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "One of low, moderate, or high.",
      id: "riskLevel",
      kind: "string",
      label: "Risk level",
    },
    {
      description: "Numeric suppression score behind the level.",
      id: "riskScore",
      kind: "number",
      label: "Risk score",
    },
  ],
  title: "Native Fermentation Risk Score Calculator",
});
export const runNativeFermentRiskScore = nativeFermentRiskScoreTool.execute;
export default nativeFermentRiskScoreTool;
