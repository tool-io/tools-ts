import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  asTableJsonValue,
  inferJsonTableDataType,
  tableFieldIds,
} from "../../table/adapters.js";
import type { TableData, TableJsonValue } from "../../table/definition.js";

export type JsonToTableInput = {
  readonly columnNames?: readonly string[];
  readonly json: string;
};
export type JsonToTableOutput = { readonly table: TableData };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseJson = (source: string): unknown => {
  try {
    return JSON.parse(source) as unknown;
  } catch {
    return simpleError("json", "Enter valid JSON.", "invalid_json");
  }
};

const ensureSize = (rows: number, columns: number): void => {
  if (rows * columns > toolResourceLimits.generatedValues)
    simpleError(
      "json",
      `The table must not exceed ${toolResourceLimits.generatedValues.toLocaleString("en-US")} cells.`,
      "resource_limit_exceeded",
    );
};

const requireJsonCell = (value: unknown, message: string): TableJsonValue => {
  const cell = asTableJsonValue(value);
  return cell === undefined
    ? simpleError("json", message, "invalid_cell")
    : cell;
};

const createTable = (
  labels: readonly string[],
  rows: readonly (readonly TableJsonValue[])[],
): JsonToTableOutput => {
  const ids = tableFieldIds(labels);
  const types = labels.map((_, column) =>
    inferJsonTableDataType(rows.map((row) => row[column] ?? null)),
  );
  return {
    table: {
      kind: "tool.io/table",
      rows,
      schema: {
        fields: labels.map((label, column) => ({
          dataType: types[column]!,
          id: ids[column]!,
          label,
          nullable: rows.some((row) => row[column] === null),
        })),
      },
      version: 1,
    },
  };
};

export const calculateJsonToTable = (
  input: JsonToTableInput,
): JsonToTableOutput => {
  const parsed = parseJson(input.json);
  if (!Array.isArray(parsed) || parsed.length === 0)
    return simpleError(
      "json",
      "JSON must be a non-empty array of objects or arrays.",
      "array_required",
    );

  if (parsed.every(isRecord)) {
    if (input.columnNames !== undefined)
      simpleError(
        "columnNames",
        "Column names can only be supplied for array rows.",
        "unsupported_column_names",
      );
    const labels = [...new Set(parsed.flatMap((row) => Object.keys(row)))];
    if (labels.length === 0)
      simpleError("json", "Object rows must contain at least one field.");
    ensureSize(parsed.length, labels.length);
    const rows = parsed.map((record, row) =>
      labels.map((label) =>
        requireJsonCell(
          Object.hasOwn(record, label) ? record[label] : null,
          `Row ${row + 1}, field ${JSON.stringify(label)} is not a finite JSON value.`,
        ),
      ),
    );
    return createTable(labels, rows);
  }

  if (parsed.every(Array.isArray)) {
    const width = parsed[0]!.length;
    if (width === 0)
      simpleError("json", "Array rows must contain at least one cell.");
    if (parsed.some((row) => row.length !== width))
      simpleError(
        "json",
        "Every JSON array row must contain the same number of cells.",
        "inconsistent_row_count",
      );
    if (input.columnNames !== undefined && input.columnNames.length !== width)
      simpleError(
        "columnNames",
        `Provide exactly ${width} column names.`,
        "column_count_mismatch",
      );
    ensureSize(parsed.length, width);
    const labels =
      input.columnNames ??
      Array.from({ length: width }, (_, index) => `Column ${index + 1}`);
    const rows = parsed.map((sourceRow, row) =>
      sourceRow.map((value, column) =>
        requireJsonCell(
          value,
          `Row ${row + 1}, column ${column + 1} is not a finite JSON value.`,
        ),
      ),
    );
    return createTable(labels, rows);
  }

  return simpleError(
    "json",
    "JSON rows must all be objects or all be arrays.",
    "mixed_row_shapes",
  );
};

export const jsonToTableExample = {
  input: {
    json: '[{"year":2024,"strikes":317},{"year":2025,"strikes":284}]',
  },
  output: {
    table: {
      kind: "tool.io/table",
      rows: [
        [2024, 317],
        [2025, 284],
      ],
      schema: {
        fields: [
          {
            dataType: { bits: 64, kind: "integer", signed: true },
            id: "year",
            label: "year",
            nullable: false,
          },
          {
            dataType: { bits: 64, kind: "integer", signed: true },
            id: "strikes",
            label: "strikes",
            nullable: false,
          },
        ],
      },
      version: 1,
    },
  },
} satisfies ToolExample<JsonToTableInput, JsonToTableOutput>;

export const jsonToTableTool = createSimpleTool({
  calculate: (input) =>
    calculateJsonToTable({
      columnNames: input.columnNames as readonly string[] | undefined,
      json: input.json as string,
    }),
  description:
    "Convert a JSON array of records or equal-length arrays into canonical tool.io TableData, preserving nested JSON values and inferring column types.",
  id: "convert/json-to-table",
  inputs: [
    { id: "json", kind: "string", label: "JSON" },
    {
      id: "columnNames",
      kind: "stringList",
      label: "Column names for array rows",
      required: false,
    },
  ],
  outputs: [
    { format: "tool.io/table", id: "table", kind: "object", label: "Table" },
  ],
  title: "JSON to Table",
});

export const runJsonToTable = jsonToTableTool.execute;
export default jsonToTableTool;
