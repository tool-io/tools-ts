import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExtrapolationLimitInput = {
  readonly annualUncertaintyGrowthPercent: number;
  readonly baselineUncertaintyPercent: number;
  readonly criticalThresholdPercent: number;
  readonly warningThresholdPercent: number;
  readonly yearsAhead: number;
};

export type ExtrapolationLimitOutput = {
  readonly projectedUncertaintyPercent: number;
  readonly status: "critical" | "safe" | "warning";
};

export const checkExtrapolationHorizonLimit = (
  input: ExtrapolationLimitInput,
): ExtrapolationLimitOutput => {
  if (!Number.isSafeInteger(input.yearsAhead) || input.yearsAhead < 0)
    simpleError(
      "yearsAhead",
      "Years ahead must be a nonnegative integer.",
      "invalid_years_ahead",
    );
  for (const [field, value] of [
    ["baselineUncertaintyPercent", input.baselineUncertaintyPercent],
    ["annualUncertaintyGrowthPercent", input.annualUncertaintyGrowthPercent],
    ["warningThresholdPercent", input.warningThresholdPercent],
    ["criticalThresholdPercent", input.criticalThresholdPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Uncertainty values and thresholds must be finite and nonnegative.",
        "invalid_uncertainty_value",
      );
  if (input.criticalThresholdPercent < input.warningThresholdPercent)
    simpleError(
      "criticalThresholdPercent",
      "Critical threshold must be at least the warning threshold.",
      "invalid_threshold_order",
    );
  const projectedUncertaintyPercent =
    input.baselineUncertaintyPercent *
    (1 + input.annualUncertaintyGrowthPercent / 100) ** input.yearsAhead;
  if (!Number.isFinite(projectedUncertaintyPercent))
    simpleError(
      "",
      "Projected uncertainty is not finite.",
      "projection_not_finite",
    );
  return {
    projectedUncertaintyPercent,
    status:
      projectedUncertaintyPercent >= input.criticalThresholdPercent
        ? "critical"
        : projectedUncertaintyPercent >= input.warningThresholdPercent
          ? "warning"
          : "safe",
  };
};

export const extrapolationLimitExample = {
  input: {
    annualUncertaintyGrowthPercent: 20,
    baselineUncertaintyPercent: 5,
    criticalThresholdPercent: 50,
    warningThresholdPercent: 25,
    yearsAhead: 5,
  },
  output: {
    projectedUncertaintyPercent: 12.441599999999998,
    status: "safe",
  },
} satisfies ToolExample<ExtrapolationLimitInput, ExtrapolationLimitOutput>;

export const extrapolationLimitTool = createSimpleTool({
  calculate: (input) =>
    checkExtrapolationHorizonLimit({
      annualUncertaintyGrowthPercent:
        input.annualUncertaintyGrowthPercent as number,
      baselineUncertaintyPercent: input.baselineUncertaintyPercent as number,
      criticalThresholdPercent: input.criticalThresholdPercent as number,
      warningThresholdPercent: input.warningThresholdPercent as number,
      yearsAhead: input.yearsAhead as number,
    }),
  description:
    "Project compound uncertainty over a caller-supplied horizon and classify it against caller-supplied warning thresholds.",
  id: "futurology/extrapolation-horizon-limit-warning-checker",
  inputs: [
    {
      id: "annualUncertaintyGrowthPercent",
      kind: "number",
      label: "Annual uncertainty growth percent",
      minimum: 0,
      unit: "%",
    },
    {
      id: "baselineUncertaintyPercent",
      kind: "number",
      label: "Baseline uncertainty percent",
      minimum: 0,
      unit: "%",
    },
    {
      id: "criticalThresholdPercent",
      kind: "number",
      label: "Critical threshold percent",
      minimum: 0,
      unit: "%",
    },
    {
      id: "warningThresholdPercent",
      kind: "number",
      label: "Warning threshold percent",
      minimum: 0,
      unit: "%",
    },
    { id: "yearsAhead", kind: "integer", label: "Years ahead", minimum: 0 },
  ],
  outputs: [
    {
      id: "projectedUncertaintyPercent",
      kind: "number",
      label: "Projected uncertainty percent",
      minimum: 0,
      unit: "%",
    },
    {
      id: "status",
      enum: ["safe", "warning", "critical"],
      kind: "string",
      label: "Warning status",
    },
  ],
  title: "Extrapolation Horizon Limit Warning Checker",
});

export const runExtrapolationLimit = extrapolationLimitTool.execute;
export default extrapolationLimitTool;
