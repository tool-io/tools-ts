import {
  matchesModelInput,
  modelInputIssues,
} from "../core/model-definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";
import { calculateMedian } from "./median/tool.js";

export type MedianCenteredDeviationInput = {
  readonly values: readonly number[];
};
export type MedianCenteredDeviationOutput = {
  readonly count: number;
  readonly deviation: number;
  readonly median: number;
};
export const medianCenteredDeviationInputSchema = {
  additionalProperties: false,
  properties: {
    values: {
      items: { type: "number" },
      maxItems: 512,
      minItems: 1,
      type: "array",
    },
  },
  required: ["values"],
  type: "object",
} as const;
export const medianCenteredDeviationOutputSchema = {
  additionalProperties: false,
  properties: {
    count: { minimum: 1, maximum: 512, type: "integer" },
    deviation: { minimum: 0, type: "number" },
    median: { type: "number" },
  },
  required: ["count", "deviation", "median"],
  type: "object",
} as const;
const isInput = (input: unknown): input is MedianCenteredDeviationInput =>
  matchesModelInput(input, medianCenteredDeviationInputSchema);

/** Delegate ordinary medians; repair only intermediate midpoint overflow. */
const finiteMedian = (values: readonly number[]): number | null => {
  const delegated = calculateMedian({ values });
  if (delegated.ok && Number.isFinite(delegated.output.median))
    return delegated.output.median;
  const sorted = [...values].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const right = sorted[Math.floor(sorted.length / 2)];
  const left = sorted[Math.floor((sorted.length - 1) / 2)];
  if (!Number.isFinite(left) || !Number.isFinite(right)) return null;
  return left / 2 + right / 2;
};

/** Distinct mean-versus-median aggregations; neither applies normal scaling. */
export const calculateMedianCenteredDeviation = (
  input: unknown,
  aggregation: "mean" | "median",
): ToolResult<MedianCenteredDeviationOutput> => {
  if (!isInput(input))
    return invalidInput(
      modelInputIssues(input, medianCenteredDeviationInputSchema),
    );
  const median = finiteMedian(input.values);
  if (median === null)
    return invalidInput([
      {
        code: "numeric_overflow",
        field: "values",
        message: "The sample median cannot be represented as a finite number.",
      },
    ]);
  let deviation: number | null;
  if (aggregation === "median")
    deviation = finiteMedian(
      input.values.map((value) => Math.abs(value - median)),
    );
  else {
    deviation = 0;
    for (const value of input.values) {
      const difference = value - median;
      // Divide before subtracting only when the unscaled difference overflows.
      deviation += Number.isFinite(difference)
        ? Math.abs(difference) / input.values.length
        : Math.abs(value / input.values.length - median / input.values.length);
    }
  }
  if (deviation === null || !Number.isFinite(deviation))
    return invalidInput([
      {
        code: "numeric_overflow",
        field: "values",
        message:
          "The requested deviation cannot be represented as a finite number.",
      },
    ]);
  return toolSuccess({ count: input.values.length, deviation, median });
};
