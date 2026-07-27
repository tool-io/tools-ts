import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
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
  sampleVariance,
} from "../input.js";

export type TwoSampleTTestInput = {
  readonly equalVariance?: boolean;
  readonly first: readonly number[] | number | string;
  readonly second: readonly number[] | number | string;
};
export type TwoSampleTTestOutput = {
  readonly degreesOfFreedom: number;
  readonly firstMean: number;
  readonly secondMean: number;
  readonly standardError: number;
  readonly tStatistic: number;
};

export const twoSampleTTestExample = {
  input: {
    first: [1, 2, 3],
    second: [4, 5, 6],
  },
} satisfies ToolExample<TwoSampleTTestInput>;

export const calculateTwoSampleTTest = (
  input: unknown,
): ToolResult<TwoSampleTTestOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const first = finiteDataset(input.first);
  const second = finiteDataset(input.second);
  const equalVariance = input.equalVariance ?? false;
  if (
    !first ||
    !second ||
    first.length < 2 ||
    second.length < 2 ||
    typeof equalVariance !== "boolean"
  )
    return invalidInput([
      {
        code: "two_samples_required",
        field: "first",
        message: "Both samples must contain at least two finite numbers.",
      },
    ]);
  const firstVariance = sampleVariance(first);
  const secondVariance = sampleVariance(second);
  let standardError: number;
  let degreesOfFreedom: number;
  if (equalVariance) {
    const pooled =
      ((first.length - 1) * firstVariance +
        (second.length - 1) * secondVariance) /
      (first.length + second.length - 2);
    standardError = Math.sqrt(pooled * (1 / first.length + 1 / second.length));
    degreesOfFreedom = first.length + second.length - 2;
  } else {
    const firstTerm = firstVariance / first.length;
    const secondTerm = secondVariance / second.length;
    standardError = Math.sqrt(firstTerm + secondTerm);
    degreesOfFreedom =
      (firstTerm + secondTerm) ** 2 /
      (firstTerm ** 2 / (first.length - 1) +
        secondTerm ** 2 / (second.length - 1));
  }
  const firstMean = mean(first);
  const secondMean = mean(second);
  const tStatistic =
    standardError === 0
      ? firstMean === secondMean
        ? 0
        : Number.NaN
      : (firstMean - secondMean) / standardError;
  if (![standardError, degreesOfFreedom, tStatistic].every(Number.isFinite))
    return invalidInput([
      {
        code: "undefined_statistic",
        field: "first",
        message:
          "The statistic is undefined for samples with no usable variation.",
      },
    ]);
  return toolSuccess({
    degreesOfFreedom: roundStatistic(degreesOfFreedom),
    firstMean: roundStatistic(firstMean),
    secondMean: roundStatistic(secondMean),
    standardError: roundStatistic(standardError),
    tStatistic: roundStatistic(tStatistic),
  });
};

export const twoSampleTTestTool = defineTool<
  TwoSampleTTestInput,
  TwoSampleTTestOutput
>({
  contractVersion: 1,
  description: "Calculate Welch's or pooled two-sample t-test statistic.",
  execute: calculateTwoSampleTTest,
  execution: { kind: "pure" },
  id: "statistics/two-sample-t-test",
  inputSchema: {
    additionalProperties: false,
    properties: {
      equalVariance: { default: false, type: "boolean" },
      first: numericDatasetSchema,
      second: numericDatasetSchema,
    },
    required: ["first", "second"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      degreesOfFreedom: { exclusiveMinimum: 0, type: "number" },
      firstMean: { type: "number" },
      secondMean: { type: "number" },
      standardError: { minimum: 0, type: "number" },
      tStatistic: { type: "number" },
    },
    required: [
      "degreesOfFreedom",
      "firstMean",
      "secondMean",
      "standardError",
      "tStatistic",
    ],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "first",
        label: "First sample",
        required: true,
        valueType: { items: { type: "number" }, type: "list" },
      },
      {
        id: "second",
        label: "Second sample",
        required: true,
        valueType: { items: { type: "number" }, type: "list" },
      },
      {
        id: "equalVariance",
        label: "Assume equal variance",
        required: false,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "tStatistic",
        label: "T statistic",
        path: ["tStatistic"],
        valueType: { format: "t-statistic", type: "number" },
      },
    ],
  },
  title: "Two-Sample T-Test Calculator",
});
export default twoSampleTTestTool;
