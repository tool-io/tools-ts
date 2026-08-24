import type { ToolExample } from "../core/example.js";
import { defineTool } from "../core/definition.js";
import { invalidInput, toolSuccess } from "../core/result.js";
import {
  createTableDocument,
  type TableData,
  type TableDocument,
  type TableSpec,
  validateTableData,
} from "./definition.js";

export type TableToolInput = {
  readonly data: TableData;
  readonly spec?: Partial<TableSpec>;
};

export type TableToolOutput = { readonly document: TableDocument };

const exampleData: TableData = {
  kind: "toolio/table",
  rows: [
    ["2026-08-27T20:00:00Z", 12],
    ["2026-08-27T21:00:00Z", 72],
  ],
  schema: {
    fields: [
      {
        dataType: { kind: "timestamp", timezone: "UTC", unit: "second" },
        id: "hour",
        label: "Hour (UTC)",
        nullable: false,
      },
      {
        dataType: { bits: 32, kind: "integer", signed: false },
        id: "strike-count",
        label: "Lightning strikes",
        nullable: false,
        unit: "strike",
      },
    ],
  },
  version: 1,
};

export const tableExample = {
  input: { data: exampleData },
  output: {
    document: createTableDocument(exampleData),
  },
} satisfies ToolExample<TableToolInput, TableToolOutput>;

export const tableTool = defineTool<TableToolInput, TableToolOutput>({
  contractVersion: 1,
  description:
    "Validate portable Tool.io tabular data and create a renderer-independent table document.",
  discovery: {
    collections: ["data"],
    keywords: ["data", "dataset", "grid", "rows", "table"],
  },
  execution: { kind: "pure" },
  execute: (input) => {
    if (typeof input !== "object" || input === null || Array.isArray(input))
      return invalidInput([
        {
          code: "object_required",
          field: "",
          message: "Input must be an object.",
        },
      ]);
    const candidate = input as Partial<TableToolInput>;
    const issues = validateTableData(candidate.data);
    if (issues.length > 0) return invalidInput(issues);
    if (
      candidate.spec !== undefined &&
      (typeof candidate.spec !== "object" ||
        candidate.spec === null ||
        Array.isArray(candidate.spec))
    )
      return invalidInput([
        {
          code: "invalid_table_spec",
          field: "spec",
          message: "Table specification must be an object.",
        },
      ]);
    if (
      candidate.spec?.columns !== undefined &&
      (!Array.isArray(candidate.spec.columns) ||
        candidate.spec.columns.some(
          (column) =>
            typeof column !== "object" ||
            column === null ||
            typeof column.field !== "string",
        ))
    )
      return invalidInput([
        {
          code: "invalid_table_columns",
          field: "spec.columns",
          message: "Every table column needs a field name.",
        },
      ]);
    if (
      candidate.spec?.defaultSort !== undefined &&
      (!Array.isArray(candidate.spec.defaultSort) ||
        candidate.spec.defaultSort.some(
          (sort) =>
            typeof sort !== "object" ||
            sort === null ||
            typeof sort.field !== "string" ||
            !["ascending", "descending"].includes(sort.direction),
        ))
    )
      return invalidInput([
        {
          code: "invalid_table_sort",
          field: "spec.defaultSort",
          message:
            "Every sort needs a field and ascending or descending direction.",
        },
      ]);
    return toolSuccess({
      document: createTableDocument(
        candidate.data as TableData,
        candidate.spec ?? {},
      ),
    });
  },
  id: "table",
  inputSchema: {
    additionalProperties: false,
    properties: {
      data: { additionalProperties: true, type: "object" },
      spec: { additionalProperties: true, type: "object" },
    },
    required: ["data"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      document: { additionalProperties: true, type: "object" },
    },
    required: ["document"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "data",
        label: "Table data",
        valueType: { format: "table/toolio", type: "object" },
      },
      {
        id: "spec",
        label: "Table specification",
        required: false,
        valueType: { format: "table/spec", type: "object" },
      },
    ],
    outputs: [
      {
        id: "document",
        label: "Table document",
        valueType: { format: "table/document", type: "object" },
      },
    ],
  },
  title: "Table",
});

export const runTable = tableTool.execute;
export default tableTool;
