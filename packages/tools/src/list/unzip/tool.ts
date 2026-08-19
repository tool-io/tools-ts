import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";

export type UnzipInput = {
  readonly table: Record<string, unknown>;
};

export type UnzipOutput = {
  readonly columns: Record<string, unknown[]>;
};

export const unzipExample = {
  input: {
    table: {
      columns: ["letters", "numbers"],
      rows: [["a", 1], ["b", 2]],
    },
  },
  output: { columns: { letters: ["a", "b"], numbers: [1, 2] } },
} satisfies ToolExample<UnzipInput, UnzipOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateUnzip = (input: UnzipInput): UnzipOutput => {
  const table = input.table as Record<string, unknown>;
  const rawRows: unknown = table.rows;
  if (!Array.isArray(rawRows) || rawRows.length === 0)
    simpleError("table", "Provide at least one row.", "no_rows");
  const rows = rawRows as unknown[];
  let names: string[] | undefined;
  if (Array.isArray(table.columns))
    names = (table.columns as unknown[]).map((name) => String(name));
  const firstRowCandidate: unknown = rows[0];
  if (!Array.isArray(firstRowCandidate))
    simpleError("table", "Every row must be an array.", "invalid_row");
  const firstRow = firstRowCandidate as unknown[];
  if (!names) names = firstRow.map((_, index) => String(index));
  if (names.length !== firstRow.length)
    simpleError(
      "table",
      "The column count must match the row width.",
      "width_mismatch",
    );
  const columns: Record<string, unknown[]> = {};
  for (const name of names) columns[name] = [];
  for (const [rowIndex, row] of rows.entries()) {
    const cells = row as unknown[];
    if (!Array.isArray(cells) || cells.length !== names.length)
      simpleError(
        "table",
        `Row ${rowIndex} does not match the table width.`,
        "inconsistent_row_count",
      );
    for (const [columnIndex, cell] of cells.entries())
      columns[names[columnIndex]!]!.push(cell);
  }
  if (rows.length * names.length > toolResourceLimits.generatedValues)
    simpleError(
      "table",
      `Unzipping would exceed ${toolResourceLimits.generatedValues.toLocaleString("en-US")} cells.`,
      "resource_limit_exceeded",
    );
  return { columns };
};

export const unzipTool = createSimpleTool({
  calculate: (input) => calculateUnzip(input as unknown as UnzipInput),
  description:
    "Split table rows into named columns, the inverse of zipping lists.",
  id: "list/unzip",
  inputs: [
    {
      description:
        "Table with a rows array of equal-length arrays and an optional columns array of names.",
      id: "table",
      kind: "object",
      label: "Table",
    },
  ],
  outputs: [
    {
      description: "Column name to values mapping in column order.",
      id: "columns",
      kind: "object",
      label: "Columns",
    },
  ],
  title: "List Unzip Tool",
});
export const runUnzip = unzipTool.execute;
export default unzipTool;
