import { defineTool, type ToolExecutionContext } from "../../core/definition.js";
import { resourceLimitIssue, toolResourceLimits } from "../../core/limits.js";
import { resolveRandom } from "../../core/random.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  finiteDataset,
  isRecord,
  mean,
  numericDatasetSchema,
  roundStatistic,
} from "../input.js";

export type BootstrapStatistic = "mean" | "median";

export type BootstrapStandardErrorInput = {
  readonly resamples?: number;
  readonly seed?: number;
  readonly statistic?: BootstrapStatistic;
  readonly values: readonly number[] | number | string;
};

export type BootstrapStandardErrorOutput = {
  readonly estimate: number;
  readonly resamples: number;
  readonly standardError: number;
  readonly statistic: BootstrapStatistic;
};

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

export const calculateBootstrapStandardError = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BootstrapStandardErrorOutput> => {
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
    (statistic !== "mean" && statistic !== "median")
  ) {
    return invalidInput([
      {
        code: "valid_bootstrap_input_required",
        field: "values",
        message:
          "Provide at least two finite values, two or more resamples, an integer seed, and a supported statistic.",
      },
    ]);
  }

  const summarize = estimator(statistic);
  const random = resolveRandom(input.seed === undefined ? undefined : (seed as number), context);
  const estimates: number[] = [];
  for (let iteration = 0; iteration < (resamples as number); iteration += 1) {
    const sample = Array.from(
      { length: values.length },
      () => values[Math.floor(random() * values.length)]!,
    );
    estimates.push(summarize(sample));
  }
  const estimateMean = mean(estimates);
  const standardError = Math.sqrt(
    estimates.reduce(
      (sum, estimate) => sum + (estimate - estimateMean) ** 2,
      0,
    ) /
      (estimates.length - 1),
  );

  return toolSuccess({
    estimate: roundStatistic(summarize(values)),
    resamples: resamples as number,
    standardError: roundStatistic(standardError),
    statistic,
  });
};

export const bootstrapStandardErrorTool = defineTool<
  BootstrapStandardErrorInput,
  BootstrapStandardErrorOutput
>({
  contractVersion: 1,
  description:
    "Estimate the standard error of a sample mean or median with deterministic bootstrap resampling.",
  execute: calculateBootstrapStandardError,
  execution: { kind: "pure" },
  id: "statistics/bootstrap-standard-error",
  inputSchema: {
    additionalProperties: false,
    properties: {
      resamples: { default: 1000, maximum: toolResourceLimits.iterations, minimum: 2, type: "integer" },
      seed: { default: 2026, type: "integer" },
      statistic: { default: "mean", enum: ["mean", "median"], type: "string" },
      values: numericDatasetSchema,
    },
    required: ["values"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      estimate: { type: "number" },
      resamples: { minimum: 2, type: "integer" },
      standardError: { minimum: 0, type: "number" },
      statistic: { enum: ["mean", "median"], type: "string" },
    },
    required: ["estimate", "resamples", "standardError", "statistic"],
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
        id: "standardError",
        label: "Standard error",
        path: ["standardError"],
        valueType: { format: "standard-error", type: "number" },
      },
    ],
  },
  title: "Bootstrap Standard Error Calculator",
});

export default bootstrapStandardErrorTool;
