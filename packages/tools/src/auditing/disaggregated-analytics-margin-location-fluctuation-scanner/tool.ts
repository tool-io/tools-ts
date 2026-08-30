import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisaggregatedAnalyticsInput = {
  readonly absoluteThresholdPercent: number;
  readonly metrics: ReadonlyArray<ReadonlyArray<number>>;
};

export type DisaggregatedAnalyticsOutput = {
  readonly changePercents: ReadonlyArray<number>;
  readonly flaggedIndices: ReadonlyArray<number>;
  readonly maximumAbsoluteChangePercent: number;
};

export const scanDisaggregatedAnalytics = (
  input: DisaggregatedAnalyticsInput,
): DisaggregatedAnalyticsOutput => {
  if (
    !Number.isFinite(input.absoluteThresholdPercent) ||
    input.absoluteThresholdPercent < 0
  )
    simpleError(
      "absoluteThresholdPercent",
      "Threshold must be finite and nonnegative.",
      "invalid_threshold",
    );
  if (!Array.isArray(input.metrics))
    simpleError("metrics", "Metrics must be an array.", "metrics_required");
  const changePercents: number[] = [];
  const flaggedIndices: number[] = [];
  let maximumAbsoluteChangePercent = 0;
  for (const [index, row] of input.metrics.entries()) {
    if (!Array.isArray(row) || row.length !== 2)
      simpleError(
        `metrics.${index}`,
        "Each metric row must contain baseline and current values.",
        "invalid_metric_row",
      );
    const [baseline, current] = row;
    if (!Number.isFinite(baseline) || !Number.isFinite(current))
      simpleError(
        `metrics.${index}`,
        "Metric values must be finite.",
        "invalid_metric_value",
      );
    if (baseline === 0)
      simpleError(
        `metrics.${index}.0`,
        "Percent change is undefined for a zero baseline.",
        "zero_metric_baseline",
      );
    const changePercent = ((current - baseline) / baseline) * 100;
    if (!Number.isFinite(changePercent))
      simpleError(
        `metrics.${index}`,
        "Metric change is not finite.",
        "result_not_finite",
      );
    changePercents.push(changePercent === 0 ? 0 : changePercent);
    const absoluteChange = Math.abs(changePercent);
    maximumAbsoluteChangePercent = Math.max(
      maximumAbsoluteChangePercent,
      absoluteChange,
    );
    if (absoluteChange >= input.absoluteThresholdPercent)
      flaggedIndices.push(index);
  }
  return { changePercents, flaggedIndices, maximumAbsoluteChangePercent };
};

export const disaggregatedAnalyticsExample = {
  input: {
    absoluteThresholdPercent: 10,
    metrics: [
      [100, 125],
      [200, 190],
      [50, 40],
    ],
  },
  output: {
    changePercents: [25, -5, -20],
    flaggedIndices: [0, 2],
    maximumAbsoluteChangePercent: 25,
  },
} satisfies ToolExample<
  DisaggregatedAnalyticsInput,
  DisaggregatedAnalyticsOutput
>;

export const disaggregatedAnalyticsTool = createSimpleTool({
  calculate: (input) =>
    scanDisaggregatedAnalytics({
      absoluteThresholdPercent: input.absoluteThresholdPercent as number,
      metrics: input.metrics as number[][],
    }),
  description:
    "Calculate signed percent changes for supplied disaggregated metrics, flag rows at an absolute threshold, and report the largest change.",
  id: "auditing/disaggregated-analytics-margin-location-fluctuation-scanner",
  inputs: [
    {
      description: "Absolute percent-change review threshold.",
      id: "absoluteThresholdPercent",
      kind: "number",
      label: "Absolute threshold percent",
      minimum: 0,
    },
    {
      description: "Rows ordered as nonzero baseline value and current value.",
      id: "metrics",
      kind: "matrix",
      label: "Disaggregated metrics",
    },
  ],
  outputs: [
    { id: "changePercents", kind: "numberList", label: "Change percentages" },
    {
      id: "flaggedIndices",
      kind: "numberList",
      label: "Flagged metric indices",
    },
    {
      id: "maximumAbsoluteChangePercent",
      kind: "number",
      label: "Maximum absolute change",
      minimum: 0,
      unit: "percent",
    },
  ],
  title: "Disaggregated Analytics Margin Location Fluctuation Scanner",
});

export const runDisaggregatedAnalytics = disaggregatedAnalyticsTool.execute;
export default disaggregatedAnalyticsTool;
