import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    sex: "female",
    waistCm: 85,
  },
  output: {
    atOrAboveIncreasedRiskThreshold: false,
    classification: "below_increased_risk_threshold",
    guideline: "NIDDK_US_ADULT",
    thresholdCm: 88.9,
    waistCm: 85,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
