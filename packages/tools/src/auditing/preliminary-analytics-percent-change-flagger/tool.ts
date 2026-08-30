import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PreliminaryAnalyticsChangeInput = {
  readonly absoluteThresholdPercent: number;
  readonly currentValue: number;
  readonly previousValue: number;
};

export type PreliminaryAnalyticsChangeOutput = {
  readonly change: number;
  readonly changePercent: number;
  readonly flagged: boolean;
};

export const flagPreliminaryAnalyticsChange = (
  input: PreliminaryAnalyticsChangeInput,
): PreliminaryAnalyticsChangeOutput => {
  for (const [field, value] of [
    ["currentValue", input.currentValue],
    ["previousValue", input.previousValue],
  ] as const)
    if (!Number.isFinite(value))
      simpleError(field, `${field} must be finite.`, "finite_value_required");
  if (
    !Number.isFinite(input.absoluteThresholdPercent) ||
    input.absoluteThresholdPercent < 0
  )
    simpleError(
      "absoluteThresholdPercent",
      "The threshold must be a finite nonnegative percentage.",
      "invalid_threshold",
    );
  if (input.previousValue === 0)
    simpleError(
      "previousValue",
      "Percent change is undefined when the previous value is zero.",
      "zero_previous_value",
    );
  const change = input.currentValue - input.previousValue;
  if (!Number.isFinite(change))
    simpleError(
      "currentValue",
      "The change is outside the representable numeric range.",
      "result_not_finite",
    );
  const changePercent = (change / input.previousValue) * 100;
  if (!Number.isFinite(changePercent))
    simpleError(
      "currentValue",
      "The percent change is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    change: change === 0 ? 0 : change,
    changePercent: changePercent === 0 ? 0 : changePercent,
    flagged: Math.abs(changePercent) >= input.absoluteThresholdPercent,
  };
};

export const preliminaryAnalyticsChangeExample = {
  input: {
    absoluteThresholdPercent: 10,
    currentValue: 1_200_000,
    previousValue: 1_000_000,
  },
  output: { change: 200_000, changePercent: 20, flagged: true },
} satisfies ToolExample<
  PreliminaryAnalyticsChangeInput,
  PreliminaryAnalyticsChangeOutput
>;

export const preliminaryAnalyticsChangeTool = createSimpleTool({
  calculate: (input) =>
    flagPreliminaryAnalyticsChange({
      absoluteThresholdPercent: input.absoluteThresholdPercent as number,
      currentValue: input.currentValue as number,
      previousValue: input.previousValue as number,
    }),
  description:
    "Calculate signed preliminary-analytics change and flag it when the absolute percent change reaches a caller-supplied threshold.",
  id: "auditing/preliminary-analytics-percent-change-flagger",
  inputs: [
    {
      description: "Absolute percent-change threshold used for review.",
      id: "absoluteThresholdPercent",
      kind: "number",
      label: "Absolute threshold percent",
      minimum: 0,
    },
    {
      description: "Current-period finite metric value.",
      id: "currentValue",
      kind: "number",
      label: "Current value",
    },
    {
      description: "Prior-period finite nonzero metric value.",
      id: "previousValue",
      kind: "number",
      label: "Previous value",
    },
  ],
  outputs: [
    { id: "change", kind: "number", label: "Current minus previous" },
    {
      id: "changePercent",
      kind: "number",
      label: "Signed change percent",
      unit: "percent",
    },
    { id: "flagged", kind: "boolean", label: "Threshold reached" },
  ],
  title: "Preliminary Analytics Percent Change Flagger",
});

export const runPreliminaryAnalyticsChange =
  preliminaryAnalyticsChangeTool.execute;
export default preliminaryAnalyticsChangeTool;
