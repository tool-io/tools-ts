import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { erfc, inverseNormalCdf } from "../../core/stats.js";
import { roundStatistic } from "../input.js";

export type AbTestInput = {
  readonly confidenceLevel?: number;
  readonly conversionsA: number;
  readonly conversionsB: number;
  readonly visitorsA: number;
  readonly visitorsB: number;
};

export type AbTestOutput = {
  readonly ciHigh: number;
  readonly ciLow: number;
  readonly difference: number;
  readonly pValue: number;
  readonly rateA: number;
  readonly rateB: number;
  readonly significant: boolean;
  readonly standardError: number;
  readonly zScore: number;
};

export const abTestExample = {
  input: {
    conversionsA: 100,
    conversionsB: 140,
    visitorsA: 1000,
    visitorsB: 1000,
  },
  output: {
    ciHigh: 0.0684296137131,
    ciLow: 0.0115703862869,
    difference: 0.04,
    pValue: 0.00591585107424,
    rateA: 0.1,
    rateB: 0.14,
    significant: true,
    standardError: 0.0145327216997,
    zScore: 2.75240941282,
  },
} satisfies ToolExample<AbTestInput, AbTestOutput>;

export const calculateAbTest = (input: AbTestInput): AbTestOutput => {
  const { conversionsA, conversionsB, visitorsA, visitorsB } = input;
  if (conversionsA > visitorsA)
    simpleError(
      "conversionsA",
      "Variant A conversions cannot exceed its visitors.",
      "conversions_exceed_visitors",
    );
  if (conversionsB > visitorsB)
    simpleError(
      "conversionsB",
      "Variant B conversions cannot exceed its visitors.",
      "conversions_exceed_visitors",
    );
  const confidenceLevel = input.confidenceLevel ?? 0.95;
  const rateA = conversionsA / visitorsA;
  const rateB = conversionsB / visitorsB;
  const pooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(
    pooled * (1 - pooled) * (1 / visitorsA + 1 / visitorsB),
  );
  const difference = rateB - rateA;
  const zScore = standardError === 0 ? 0 : difference / standardError;
  // Two-sided p-value: 2 * (1 - Phi(|z|)) equals erfc(|z| / sqrt(2)).
  const pValue = erfc(Math.abs(zScore) / Math.SQRT2);
  const alpha = 1 - confidenceLevel;
  const criticalValue = inverseNormalCdf(1 - alpha / 2);
  const intervalError = Math.sqrt(
    (rateA * (1 - rateA)) / visitorsA + (rateB * (1 - rateB)) / visitorsB,
  );
  return {
    ciHigh: roundStatistic(difference + criticalValue * intervalError),
    ciLow: roundStatistic(difference - criticalValue * intervalError),
    difference: roundStatistic(difference),
    pValue: Math.min(1, roundStatistic(pValue)),
    rateA: roundStatistic(rateA),
    rateB: roundStatistic(rateB),
    significant: pValue <= alpha,
    standardError: roundStatistic(standardError),
    zScore: roundStatistic(zScore),
  };
};

export const abTestTool = createSimpleTool({
  calculate: (input) => calculateAbTest(input as unknown as AbTestInput),
  description:
    "Compare two variant conversion rates with a two-proportion z-test.",
  id: "statistics/ab-test",
  inputs: [
    {
      description: "Visitors shown variant A.",
      id: "visitorsA",
      kind: "integer",
      label: "Visitors (A)",
      minimum: 1,
    },
    {
      description: "Conversions achieved by variant A.",
      id: "conversionsA",
      kind: "integer",
      label: "Conversions (A)",
      minimum: 0,
    },
    {
      description: "Visitors shown variant B.",
      id: "visitorsB",
      kind: "integer",
      label: "Visitors (B)",
      minimum: 1,
    },
    {
      description: "Conversions achieved by variant B.",
      id: "conversionsB",
      kind: "integer",
      label: "Conversions (B)",
      minimum: 0,
    },
    {
      default: 0.95,
      description:
        "Confidence level for the significance decision and difference interval.",
      id: "confidenceLevel",
      kind: "number",
      label: "Confidence level",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Conversion rate of variant A.",
      format: "proportion",
      id: "rateA",
      kind: "number",
      label: "Rate (A)",
    },
    {
      description: "Conversion rate of variant B.",
      format: "proportion",
      id: "rateB",
      kind: "number",
      label: "Rate (B)",
    },
    {
      description: "Difference in rates, B minus A.",
      id: "difference",
      kind: "number",
      label: "Difference",
    },
    {
      description: "Pooled standard error of the difference.",
      id: "standardError",
      kind: "number",
      label: "Standard error",
    },
    {
      description: "z-score of the observed difference.",
      format: "z-score",
      id: "zScore",
      kind: "number",
      label: "z-score",
    },
    {
      description: "Two-sided p-value of the z-test.",
      format: "probability",
      id: "pValue",
      kind: "number",
      label: "p-value",
    },
    {
      description: "Whether the difference is significant at the level.",
      id: "significant",
      kind: "boolean",
      label: "Significant",
    },
    {
      description: "Lower bound of the difference confidence interval.",
      id: "ciLow",
      kind: "number",
      label: "CI lower bound",
    },
    {
      description: "Upper bound of the difference confidence interval.",
      id: "ciHigh",
      kind: "number",
      label: "CI upper bound",
    },
  ],
  title: "A/B Test Result Analyzer",
});
export const runAbTest = abTestTool.execute;
export default abTestTool;
