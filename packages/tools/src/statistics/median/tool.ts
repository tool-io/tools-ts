import { defineTool } from "../../core/definition.js";
import {
  datasetNumberType,
  numberFiniteType,
} from "../../core/semantic-type.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import { parseNumericDataset } from "../../parse/numeric-dataset/tool.js";

export type MedianInput = {
  readonly values: readonly number[] | number | string;
};

export type MedianOutput = {
  readonly median: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const medianInputSchema = {
  additionalProperties: false,
  properties: {
    values: {
      anyOf: [
        { items: { type: "number" }, minItems: 1, type: "array" },
        { type: "number" },
        { type: "string" },
      ],
    },
  },
  required: ["values"],
  type: "object",
} as const;

export const medianOutputSchema = {
  additionalProperties: false,
  properties: { median: { type: "number" } },
  required: ["median"],
  type: "object",
} as const;

export const calculateMedian = (
  input: unknown,
): ToolResult<MedianOutput> => {
  if (!isRecord(input)) {
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  }

  const issues: ToolIssue[] = Object.keys(input)
    .filter((field) => field !== "values")
    .map((field) => ({
      code: "unknown_field",
      field,
      message: `${field} is not a supported input field.`,
    }));
  if (issues.length > 0) return invalidInput(issues);

  let values: readonly number[];
  if (Array.isArray(input.values)) {
    if (
      input.values.length === 0 ||
      !input.values.every(
        (value) => typeof value === "number" && Number.isFinite(value),
      )
    ) {
      return invalidInput([
        {
          code: "finite_numeric_dataset_required",
          field: "values",
          message: "values must be a non-empty list of finite numbers.",
        },
      ]);
    }
    values = input.values as number[];
  } else {
    const parsed = parseNumericDataset({ value: input.values });
    if (!parsed.ok) return invalidInput(parsed.error.issues);
    values = parsed.output.values;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? ((sorted[middle - 1] as number) + (sorted[middle] as number)) / 2
      : (sorted[middle] as number);

  return toolSuccess({ median });
};

export const medianTool = defineTool<MedianInput, MedianOutput>({
  contractVersion: 1,
  description: "Calculate the median of a finite numeric dataset.",
  execute: calculateMedian,
  executionKind: "pure",
  id: "statistics/median",
  inputSchema: medianInputSchema,
  isOutput: (value): value is MedianOutput =>
    isRecord(value) &&
    typeof value.median === "number" &&
    Number.isFinite(value.median),
  outputSchema: medianOutputSchema,
  ports: {
    inputs: [
      {
        id: "values",
        label: "Numeric dataset",
        required: true,
        type: datasetNumberType,
      },
    ],
    outputs: [
      {
        id: "median",
        label: "Median",
        type: numberFiniteType,
      },
    ],
  },
  title: "Median Calculator",
});

export default medianTool;
