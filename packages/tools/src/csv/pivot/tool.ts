import { CsvParseError, parseCsv } from "../../core/csv.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PivotAggregation = "count" | "max" | "mean" | "min" | "sum";

export type PivotInput = {
  readonly aggregation?: string;
  readonly csv: string;
  readonly delimiter?: string;
  readonly groupBy: readonly string[];
  readonly hasHeader?: boolean;
  readonly valueColumn?: string;
};

export type PivotOutput = {
  readonly table: {
    readonly columns: string[];
    readonly rows: (string | number)[][];
  };
};

const NUMBER_PATTERN = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/u;

export const pivotExample = {
  input: {
    aggregation: "sum",
    csv: "region,units\neast,5\nwest,2\nwest,3\n",
    groupBy: ["region"],
    valueColumn: "units",
  },
  output: {
    table: {
      columns: ["region", "units_sum"],
      rows: [["east", 5], ["west", 5]],
    },
  },
} satisfies ToolExample<PivotInput, PivotOutput>;

const aggregate = (
  aggregation: PivotAggregation,
  bucket: { count: number; values: readonly number[] },
): number => {
  if (aggregation === "count") return bucket.count;
  const values = bucket.values;
  // Groups without numeric values contribute zero.
  if (values.length === 0) return 0;
  if (aggregation === "sum")
    return values.reduce((sum, value) => sum + value, 0);
  if (aggregation === "mean")
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  return aggregation === "min"
    ? Math.min(...values)
    : Math.max(...values);
};

export const calculatePivot = (input: PivotInput): PivotOutput => {
  const groupBy = input.groupBy as readonly string[];
  const aggregation = (input.aggregation ?? "sum") as PivotAggregation;
  const valueColumn = input.valueColumn;
  if (groupBy.length === 0)
    simpleError(
      "groupBy",
      "Select at least one column to group by.",
      "group_columns_required",
    );
  if (input.hasHeader === false)
    simpleError(
      "hasHeader",
      "Pivoting requires a header row.",
      "header_required",
    );
  let document;
  try {
    document = parseCsv(input.csv, {
      delimiter: input.delimiter ?? ",",
      hasHeader: true,
    });
  } catch (error) {
    if (error instanceof CsvParseError)
      simpleError("csv", error.message, error.code);
    throw error;
  }
  if (!document.header)
    simpleError(
      "csv",
      "CSV input needs at least a header row.",
      "missing_header",
    );
  const header = document.header as readonly string[];
  const columnIndex = new Map(header.map((name, index) => [name, index]));
  const groupIndexes = groupBy.map((column) => {
    const index = columnIndex.get(column);
    if (index === undefined)
      simpleError(
        "groupBy",
        `Column "${column}" is not in the CSV header.`,
        "unknown_column",
      );
    return index!;
  });
  let valueIndex: number | undefined;
  if (valueColumn !== undefined) {
    valueIndex = columnIndex.get(valueColumn);
    if (valueIndex === undefined)
      simpleError(
        "valueColumn",
        `Column "${valueColumn}" is not in the CSV header.`,
        "unknown_column",
      );
  } else if (aggregation !== "count")
    simpleError(
      "valueColumn",
      "A value column is required unless counting rows.",
      "value_column_required",
    );

  type Bucket = { count: number; key: string[]; values: number[] };
  const buckets = new Map<string, Bucket>();
  for (const row of document.rows) {
    if (row.length !== header.length)
      simpleError(
        "csv",
        "Every CSV row must have the same number of cells as the header.",
        "inconsistent_row_count",
      );
    const key = groupIndexes.map((index) => row[index]!).join("\u0000");
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = {
        count: 0,
        key: groupIndexes.map((index) => row[index]!),
        values: [],
      };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    if (valueIndex !== undefined && aggregation !== "count") {
      const cell = row[valueIndex]!.trim();
      if (cell === "") continue;
      if (!NUMBER_PATTERN.test(cell))
        simpleError(
          "valueColumn",
          `Value "${cell}" in column "${valueColumn}" is not numeric.`,
          "non_numeric_value",
        );
      bucket.values.push(Number(cell));
    }
  }
  const orderedKeys = [...buckets.keys()].sort((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
  const aggregateLabel =
    aggregation === "count" || valueColumn === undefined
      ? aggregation
      : `${valueColumn}_${aggregation}`;
  return {
    table: {
      columns: [...groupBy, aggregateLabel],
      rows: orderedKeys.map((key) => {
        const bucket = buckets.get(key)!;
        return [
          ...bucket.key,
          aggregate(aggregation, bucket),
        ];
      }),
    },
  };
};

export const pivotTool = createSimpleTool({
  calculate: (input) => calculatePivot(input as unknown as PivotInput),
  description:
    "Aggregate CSV rows into a deterministic grouped pivot table.",
  id: "csv/pivot",
  inputs: [
    {
      description: "CSV text with a header row to pivot.",
      id: "csv",
      kind: "string",
      label: "CSV",
    },
    {
      default: ",",
      description: "Single-character field delimiter.",
      enum: [",", ";", "\t", "|"],
      id: "delimiter",
      kind: "string",
      label: "Delimiter",
    },
    {
      description: "Columns whose distinct values form the groups.",
      id: "groupBy",
      kind: "stringList",
      label: "Group columns",
    },
    {
      default: "sum",
      description: "Aggregation applied to the value column per group.",
      enum: ["count", "sum", "mean", "min", "max"],
      id: "aggregation",
      kind: "string",
      label: "Aggregation",
    },
    {
      description:
        "Numeric column to aggregate; optional when counting rows.",
      id: "valueColumn",
      kind: "string",
      label: "Value column",
      required: false,
    },
  ],
  outputs: [
    {
      description:
        "Pivot table with sorted group keys and one aggregated column.",
      id: "table",
      kind: "object",
      label: "Pivot table",
    },
  ],
  title: "CSV Pivot Table Tool",
});
export const runPivot = pivotTool.execute;
export default pivotTool;
