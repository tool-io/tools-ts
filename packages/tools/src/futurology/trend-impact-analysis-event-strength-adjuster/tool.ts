import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrendImpactInput = {
  readonly adjusterWeights: ReadonlyArray<number>;
  readonly baseImpact: number;
  readonly presentAdjusterFlags: ReadonlyArray<number>;
  readonly trendMultiplier: number;
};

export type TrendImpactOutput = {
  readonly adjustedImpact: number;
  readonly adjustmentFactor: number;
  readonly totalAdjusterWeight: number;
};

export const adjustTrendImpactStrength = (
  input: TrendImpactInput,
): TrendImpactOutput => {
  if (!Number.isFinite(input.baseImpact) || input.baseImpact < 0)
    simpleError(
      "baseImpact",
      "Base impact must be finite and nonnegative.",
      "invalid_base_impact",
    );
  if (!Number.isFinite(input.trendMultiplier) || input.trendMultiplier < 0)
    simpleError(
      "trendMultiplier",
      "Trend multiplier must be finite and nonnegative.",
      "invalid_trend_multiplier",
    );
  if (
    !Array.isArray(input.adjusterWeights) ||
    !Array.isArray(input.presentAdjusterFlags)
  )
    simpleError(
      "",
      "Adjuster weights and presence flags must be arrays.",
      "adjuster_data_required",
    );
  if (input.adjusterWeights.length !== input.presentAdjusterFlags.length)
    simpleError(
      "presentAdjusterFlags",
      "Each adjuster weight must have one presence flag.",
      "adjuster_data_length_mismatch",
    );
  let totalAdjusterWeight = 0;
  for (const [index, weight] of input.adjusterWeights.entries()) {
    const present = input.presentAdjusterFlags[index]!;
    if (!Number.isFinite(weight) || weight < 0)
      simpleError(
        `adjusterWeights.${index}`,
        "Adjuster weights must be finite and nonnegative.",
        "invalid_adjuster_weight",
      );
    if (present !== 0 && present !== 1)
      simpleError(
        `presentAdjusterFlags.${index}`,
        "Presence flags must be 0 or 1.",
        "invalid_adjuster_flag",
      );
    if (present === 1) totalAdjusterWeight += weight;
    if (!Number.isFinite(totalAdjusterWeight))
      simpleError(
        `adjusterWeights.${index}`,
        "Total adjuster weight is not finite.",
        "result_not_finite",
      );
  }
  const adjustmentFactor = input.trendMultiplier * (1 + totalAdjusterWeight);
  const adjustedImpact = input.baseImpact * adjustmentFactor;
  if (!Number.isFinite(adjustedImpact))
    simpleError(
      "baseImpact",
      "Adjusted impact is not finite.",
      "result_not_finite",
    );
  return { adjustedImpact, adjustmentFactor, totalAdjusterWeight };
};

export const trendImpactExample = {
  input: {
    adjusterWeights: [0.2, 0.3, 0.1],
    baseImpact: 100,
    presentAdjusterFlags: [1, 0, 1],
    trendMultiplier: 2,
  },
  output: {
    adjustedImpact: 260,
    adjustmentFactor: 2.6,
    totalAdjusterWeight: 0.30000000000000004,
  },
} satisfies ToolExample<TrendImpactInput, TrendImpactOutput>;

export const trendImpactTool = createSimpleTool({
  calculate: (input) =>
    adjustTrendImpactStrength({
      adjusterWeights: input.adjusterWeights as number[],
      baseImpact: input.baseImpact as number,
      presentAdjusterFlags: input.presentAdjusterFlags as number[],
      trendMultiplier: input.trendMultiplier as number,
    }),
  description:
    "Adjust a base trend-impact score by a nonnegative multiplier and the sum of selected caller-supplied adjuster weights.",
  id: "futurology/trend-impact-analysis-event-strength-adjuster",
  inputs: [
    { id: "adjusterWeights", kind: "numberList", label: "Adjuster weights" },
    { id: "baseImpact", kind: "number", label: "Base impact", minimum: 0 },
    {
      id: "presentAdjusterFlags",
      kind: "numberList",
      label: "Present adjuster flags",
    },
    {
      id: "trendMultiplier",
      kind: "number",
      label: "Trend multiplier",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "adjustedImpact",
      kind: "number",
      label: "Adjusted impact",
      minimum: 0,
    },
    {
      id: "adjustmentFactor",
      kind: "number",
      label: "Adjustment factor",
      minimum: 0,
    },
    {
      id: "totalAdjusterWeight",
      kind: "number",
      label: "Total adjuster weight",
      minimum: 0,
    },
  ],
  title: "Trend Impact Analysis Event Strength Adjuster",
});

export const runTrendImpact = trendImpactTool.execute;
export default trendImpactTool;
