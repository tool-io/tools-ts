import { CsvParseError, parseCsv } from "../../core/csv.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  coerceTextTableCell,
  inferTextTableDataType,
  tableFieldIds,
} from "../../table/adapters.js";
import type { TableData } from "../../table/definition.js";

export type CsvToTableInput = {
  readonly csv: string;
  readonly delimiter?: string;
  readonly hasHeader?: boolean;
  readonly inferTypes?: boolean;
};
export type CsvToTableOutput = { readonly table: TableData };

export const calculateCsvToTable = (
  input: CsvToTableInput,
): CsvToTableOutput => {
  let document;
  const hasHeader = input.hasHeader ?? true;
  try {
    document = parseCsv(input.csv, {
      delimiter: input.delimiter ?? ",",
      hasHeader,
    });
  } catch (error) {
    if (error instanceof CsvParseError)
      simpleError("csv", error.message, error.code);
    throw error;
  }
  const width = document.header?.length ?? document.rows[0]?.length ?? 0;
  if (width === 0) simpleError("csv", "CSV input is empty.", "empty_csv");
  if (document.rows.some((row) => row.length !== width))
    simpleError(
      "csv",
      "Every CSV row must contain the same number of cells.",
      "inconsistent_row_count",
    );
  const labels =
    document.header ??
    Array.from({ length: width }, (_, index) => `Column ${index + 1}`);
  if (new Set(labels).size !== labels.length)
    simpleError("csv", "CSV headers must be unique.", "duplicate_header");
  const ids = tableFieldIds(labels);
  const types = Array.from({ length: width }, (_, index) =>
    input.inferTypes === false
      ? ({ kind: "string" } as const)
      : inferTextTableDataType(document.rows.map((row) => row[index]!)),
  );
  return {
    table: {
      kind: "tool.io/table",
      rows: document.rows.map((row) =>
        row.map((cell, index) => coerceTextTableCell(cell, types[index]!)),
      ),
      schema: {
        fields: labels.map((label, index) => ({
          dataType: types[index]!,
          id: ids[index]!,
          label,
          nullable: document.rows.some((row) => row[index]?.trim() === ""),
        })),
      },
      version: 1,
    },
  };
};

export const csvToTableExample = {
  input: { csv: "hour,strikes\n20:00,12\n21:00,72\n" },
  output: {
    table: {
      kind: "tool.io/table",
      rows: [
        ["20:00", 12],
        ["21:00", 72],
      ],
      schema: {
        fields: [
          {
            dataType: { kind: "string" },
            id: "hour",
            label: "hour",
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
} satisfies ToolExample<CsvToTableInput, CsvToTableOutput>;

export const csvToTableTool = createSimpleTool({
  calculate: (input) =>
    calculateCsvToTable({
      csv: input.csv as string,
      delimiter: input.delimiter as string | undefined,
      hasHeader: input.hasHeader as boolean | undefined,
      inferTypes: input.inferTypes as boolean | undefined,
    }),
  description:
    "Parse CSV text into the canonical portable Tool.io table representation.",
  id: "convert/csv-to-table",
  inputs: [
    { id: "csv", kind: "string", label: "CSV" },
    {
      default: ",",
      enum: [",", ";", "\t", "|"],
      id: "delimiter",
      kind: "string",
      label: "Delimiter",
    },
    {
      default: true,
      id: "hasHeader",
      kind: "boolean",
      label: "First row is header",
    },
    {
      default: true,
      id: "inferTypes",
      kind: "boolean",
      label: "Infer column types",
    },
  ],
  outputs: [
    {
      format: "tool.io/table",
      id: "table",
      kind: "object",
      label: "Table",
    },
  ],
  title: "CSV to Table",
});

export const runCsvToTable = csvToTableTool.execute;
export default csvToTableTool;
