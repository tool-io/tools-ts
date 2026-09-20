import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesModelInput } from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type ChiSquareIndependenceInput = {
  readonly observed: readonly (readonly number[])[];
};
export type ChiSquareIndependenceOutput = {
  readonly chiSquare: number;
  readonly degreesOfFreedom: number;
  readonly expected: readonly (readonly number[])[];
  readonly total: number;
};

export const chiSquareIndependenceInputSchema = {
  additionalProperties: false,
  properties: {
    observed: {
      items: {
        items: { minimum: 0, type: "integer" },
        maxItems: 32,
        minItems: 2,
        type: "array",
      },
      maxItems: 32,
      minItems: 2,
      type: "array",
    },
  },
  required: ["observed"],
  type: "object",
} as const;

export const chiSquareIndependenceOutputSchema = {
  additionalProperties: false,
  properties: {
    chiSquare: { minimum: 0, type: "number" },
    degreesOfFreedom: { minimum: 1, type: "integer" },
    expected: {
      items: { items: { type: "number" }, type: "array" },
      type: "array",
    },
    total: { minimum: 1, type: "integer" },
  },
  required: ["chiSquare", "degreesOfFreedom", "expected", "total"],
  type: "object",
} as const;

const isInput = (input: unknown): input is ChiSquareIndependenceInput =>
  matchesModelInput(input, chiSquareIndependenceInputSchema);

/** Pearson's uncorrected RxC statistic; no p-value or applicability inference. */
export const calculateChiSquareIndependence = (
  input: unknown,
): ToolResult<ChiSquareIndependenceOutput> => {
  if (!isInput(input))
    return invalidInput([
      {
        code: "invalid_contingency_table",
        field: "observed",
        message:
          "Provide a 2–32 by 2–32 table of nonnegative safe integer counts.",
      },
    ]);
  const columns = input.observed[0]?.length ?? 0;
  if (input.observed.some((row) => row.length !== columns))
    return invalidInput([
      {
        code: "ragged_table",
        field: "observed",
        message: "Every row must have the same number of columns.",
      },
    ]);
  const rowTotals = input.observed.map((row) => row.reduce((a, b) => a + b, 0));
  const columnTotals = Array.from({ length: columns }, (_, column) =>
    input.observed.reduce((sum, row) => sum + (row[column] ?? 0), 0),
  );
  const total = rowTotals.reduce((a, b) => a + b, 0);
  if (!Number.isSafeInteger(total))
    return invalidInput([
      {
        code: "unsafe_count_total",
        field: "observed",
        message: "The sum of counts must be a safe integer.",
      },
    ]);
  if (
    rowTotals.some((value) => value === 0) ||
    columnTotals.some((value) => value === 0)
  )
    return invalidInput([
      {
        code: "zero_marginal",
        field: "observed",
        message:
          "Remove empty row and column categories before calculating the statistic.",
      },
    ]);
  const expected = rowTotals.map((rowTotal) =>
    columnTotals.map((columnTotal) => (rowTotal / total) * columnTotal),
  );
  let chiSquare = 0;
  input.observed.forEach((row, r) =>
    row.forEach((observed, c) => {
      const expectedCount = expected[r]?.[c] ?? 0;
      chiSquare += (observed - expectedCount) ** 2 / expectedCount;
    }),
  );
  return toolSuccess({
    chiSquare,
    degreesOfFreedom: (rowTotals.length - 1) * (columns - 1),
    expected,
    total,
  });
};

export const chiSquareIndependenceExample = {
  input: {
    observed: [
      [20, 10, 0],
      [0, 20, 10],
      [10, 0, 20],
    ],
  },
  output: {
    chiSquare: 60,
    degreesOfFreedom: 4,
    expected: [
      [10, 10, 10],
      [10, 10, 10],
      [10, 10, 10],
    ],
    total: 90,
  },
} satisfies ToolExample<
  ChiSquareIndependenceInput,
  ChiSquareIndependenceOutput
>;

export const chiSquareIndependenceTool = defineTool<
  ChiSquareIndependenceInput,
  ChiSquareIndependenceOutput
>({
  contractVersion: 1,
  description:
    "Calculate Pearson's uncorrected independence statistic and expected counts for an RxC contingency table, without a p-value or small-sample validity claim.",
  execute: calculateChiSquareIndependence,
  execution: { kind: "pure" },
  id: "statistics/chi-square-independence",
  inputSchema: chiSquareIndependenceInputSchema,
  outputSchema: chiSquareIndependenceOutputSchema,
  ports: {
    inputs: [
      {
        id: "observed",
        label: "Observed counts",
        required: true,
        valueType: {
          items: { items: { type: "integer" }, type: "list" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "chiSquare",
        label: "Pearson statistic",
        valueType: { type: "number" },
      },
      {
        id: "degreesOfFreedom",
        label: "Degrees of freedom",
        valueType: { type: "integer" },
      },
      {
        id: "expected",
        label: "Expected counts",
        valueType: {
          items: { items: { type: "number" }, type: "list" },
          type: "list",
        },
      },
      { id: "total", label: "Total count", valueType: { type: "integer" } },
    ],
  },
  title: "Chi-Square Independence Statistic Calculator",
});
export const runChiSquareIndependence = chiSquareIndependenceTool.execute;
export default chiSquareIndependenceTool;
