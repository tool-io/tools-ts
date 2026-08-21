import {
  defineTool,
  type ToolExecutionContext,
} from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createToolExecutionControl,
  progressInterval,
  shouldReportProgress,
} from "../../core/execution.js";
import { resourceLimitIssue, toolResourceLimits } from "../../core/limits.js";
import { resolveRandom } from "../../core/random.js";
import {
  invalidInput,
  toolExecutionCancelled,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { percentileFromSorted } from "../../core/stats.js";
import {
  finiteDataset,
  isRecord,
  mean,
  numericDatasetSchema,
  roundStatistic,
} from "../input.js";

export type BootstrapStatistic = "mean" | "median";

export type BootstrapConfidenceIntervalInput = {
  readonly level?: number;
  readonly resamples?: number;
  readonly seed?: number;
  readonly statistic?: BootstrapStatistic;
  readonly values: readonly number[] | number | string;
};

export type BootstrapConfidenceIntervalOutput = {
  readonly estimate: number;
  readonly high: number;
  readonly level: number;
  readonly low: number;
  readonly resamples: number;
  readonly statistic: BootstrapStatistic;
};

export const bootstrapConfidenceIntervalExample = {
  input: { level: 0.9, resamples: 200, seed: 42, values: [1, 2, 4, 8] },
} satisfies ToolExample<BootstrapConfidenceIntervalInput>;

const median = (values: readonly number[]): number => {
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 === 0
    ? (ordered[middle - 1]! + ordered[middle]!) / 2
    : ordered[middle]!;
};

const estimator = (
  statistic: BootstrapStatistic,
): ((values: readonly number[]) => number) =>
  statistic === "median" ? median : mean;

export const calculateBootstrapConfidenceInterval = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BootstrapConfidenceIntervalOutput> => {
  const execution = createToolExecutionControl(context);
  if (!execution.checkpoint()) return toolExecutionCancelled();
  if (!isRecord(input)) {
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  }

  const values = finiteDataset(input.values);
  const resamples = input.resamples ?? 1000;
  const seed = input.seed ?? 2026;
  const statistic = input.statistic ?? "mean";
  const level = input.level ?? 0.95;
  const limitIssues = [
    resourceLimitIssue("samples", values?.length ?? 0, "values"),
    resourceLimitIssue("iterations", Number(resamples), "resamples"),
  ].filter((issue) => issue !== undefined);
  if (limitIssues.length > 0) return invalidInput(limitIssues);
  if (
    !values ||
    values.length < 2 ||
    !Number.isSafeInteger(resamples) ||
    (resamples as number) < 2 ||
    !Number.isSafeInteger(seed) ||
    (statistic !== "mean" && statistic !== "median") ||
    !Number.isFinite(level) ||
    (level as number) <= 0 ||
    (level as number) >= 1
  ) {
    return invalidInput([
      {
        code: "valid_bootstrap_input_required",
        field: "values",
        message:
          "Provide at least two finite values, two or more resamples, an integer seed, a supported statistic, and a confidence level between zero and one.",
      },
    ]);
  }

  const summarize = estimator(statistic);
  const random = resolveRandom(
    input.seed === undefined ? undefined : (seed as number),
    context,
  );
  const estimates: number[] = [];
  const progressEvery = progressInterval(resamples as number);
  const progressMessage = "Generating bootstrap resamples";
  if (
    !execution.checkpoint({
      completed: 0,
      message: progressMessage,
      total: resamples as number,
    })
  )
    return toolExecutionCancelled();
  for (let iteration = 0; iteration < (resamples as number); iteration += 1) {
    if (!execution.checkpoint()) return toolExecutionCancelled();
    const sample = Array.from(
      { length: values.length },
      () => values[Math.floor(random() * values.length)]!,
    );
    estimates.push(summarize(sample));
    const completed = iteration + 1;
    if (
      shouldReportProgress(completed, resamples as number, progressEvery) &&
      !execution.checkpoint({
        completed,
        message: progressMessage,
        total: resamples as number,
      })
    )
      return toolExecutionCancelled();
  }

  const ordered = [...estimates].sort((left, right) => left - right);
  const tailPercent = (1 - (level as number)) * 100;
  return toolSuccess({
    estimate: roundStatistic(summarize(values)),
    high: roundStatistic(
      percentileFromSorted(ordered, 100 - tailPercent),
    ),
    level: level as number,
    low: roundStatistic(percentileFromSorted(ordered, tailPercent)),
    resamples: resamples as number,
    statistic,
  });
};

export const bootstrapConfidenceIntervalTool = defineTool<
  BootstrapConfidenceIntervalInput,
  BootstrapConfidenceIntervalOutput
>({
  contractVersion: 1,
  description:
    "Estimate a percentile bootstrap confidence interval for a sample mean or median with deterministic resampling.",
  execute: calculateBootstrapConfidenceInterval,
  execution: { kind: "pure" },
  id: "statistics/bootstrap-confidence-interval",
  inputSchema: {
    additionalProperties: false,
    properties: {
      level: {
        default: 0.95,
        exclusiveMaximum: 1,
        exclusiveMinimum: 0,
        type: "number",
      },
      resamples: {
        default: 1000,
        maximum: toolResourceLimits.iterations,
        minimum: 2,
        type: "integer",
      },
      seed: { default: 2026, type: "integer" },
      statistic: {
        default: "mean",
        enum: ["mean", "median"],
        type: "string",
      },
      values: numericDatasetSchema,
    },
    required: ["values"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      estimate: { type: "number" },
      high: { type: "number" },
      level: { exclusiveMaximum: 1, exclusiveMinimum: 0, type: "number" },
      low: { type: "number" },
      resamples: { minimum: 2, type: "integer" },
      statistic: { enum: ["mean", "median"], type: "string" },
    },
    required: ["estimate", "high", "level", "low", "resamples", "statistic"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "values",
        label: "Sample",
        required: true,
        valueType: { items: { type: "number" }, type: "list" },
      },
      {
        id: "level",
        label: "Confidence level",
        required: false,
        valueType: { format: "probability", type: "number" },
      },
      {
        id: "resamples",
        label: "Resamples",
        required: false,
        valueType: { format: "count", type: "integer" },
      },
      {
        id: "seed",
        label: "Random seed",
        required: false,
        valueType: { format: "random-seed", type: "integer" },
      },
      {
        id: "statistic",
        label: "Statistic",
        required: false,
        valueType: { format: "statistic-name", type: "string" },
      },
    ],
    outputs: [
      {
        id: "estimate",
        label: "Point estimate",
        path: ["estimate"],
        valueType: { type: "number" },
      },
      {
        id: "low",
        label: "Lower bound",
        path: ["low"],
        valueType: { type: "number" },
      },
      {
        id: "high",
        label: "Upper bound",
        path: ["high"],
        valueType: { type: "number" },
      },
    ],
  },
  title: "Bootstrap Confidence Interval Calculator",
});

export default bootstrapConfidenceIntervalTool;
