import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";

export type ZipInput = {
  readonly columns: Record<string, unknown>;
};

export type ZipOutput = {
  readonly table: {
    readonly columns: string[];
    readonly rows: unknown[][];
  };
};

export const zipExample = {
  input: { columns: { letters: ["a", "b"], numbers: [1, 2] } },
  output: {
    table: {
      columns: ["letters", "numbers"],
      rows: [["a", 1], ["b", 2]],
    },
  },
} satisfies ToolExample<ZipInput, ZipOutput>;

export const calculateZip = (input: ZipInput): ZipOutput => {
  const columns = Object.keys(input.columns as Record<string, unknown>);
  if (columns.length === 0)
    simpleError("columns", "Provide at least one column.", "no_columns");
  const columnValues = columns.map((name) => {
    const value = (input.columns as Record<string, unknown>)[name];
    if (!Array.isArray(value))
      simpleError(
        "columns",
        `Column "${name}" must be an array.`,
        "invalid_column",
      );
    return value as unknown[];
  });
  const length = columnValues[0]!.length;
  for (const [index, values] of columnValues.entries())
    if (values.length !== length)
      simpleError(
        "columns",
        `Column "${columns[index]}" has ${values.length} values but expected ${length}.`,
        "length_mismatch",
      );
  if (length * columns.length > toolResourceLimits.generatedValues)
    simpleError(
      "columns",
      `Zipping would exceed ${toolResourceLimits.generatedValues.toLocaleString("en-US")} cells.`,
      "resource_limit_exceeded",
    );
  const rows: unknown[][] = [];
  for (let row = 0; row < length; row += 1)
    rows.push(columnValues.map((values) => values[row]));
  return { table: { columns, rows } };
};

export const zipTool = createSimpleTool({
  calculate: (input) => calculateZip(input as unknown as ZipInput),
  description:
    "Zip same-length columns into rows, like the inverse of unzipping a table.",
  id: "list/zip",
  inputs: [
    {
      description:
        "Named columns of equal length; insertion order defines column order.",
      id: "columns",
      kind: "object",
      label: "Columns",
    },
  ],
  outputs: [
    {
      description: "Table with column names and zipped rows.",
      id: "table",
      kind: "object",
      label: "Zipped table",
    },
  ],
  title: "List Zip Tool",
});
export const runZip = zipTool.execute;
export default zipTool;
