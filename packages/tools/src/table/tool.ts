import type { ToolExample } from "../core/example.js";
import { defineTool } from "../core/definition.js";
import { invalidInput, toolSuccess } from "../core/result.js";
import {
  createTableDocument,
  type TableData,
  type TableDocument,
  type TableSpec,
  validateTableData,
  validateTableSpec,
} from "./definition.js";

export type TableToolInput = {
  readonly data: TableData;
  readonly spec?: Partial<TableSpec>;
};

export type TableToolOutput = { readonly document: TableDocument };

const exampleData: TableData = {
  kind: "tool.io/table",
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
    "Validate portable tool.io tabular data and create a renderer-independent table document.",
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
    const unknown = Object.keys(candidate).filter(
      (key) => key !== "data" && key !== "spec",
    );
    if (unknown.length > 0)
      return invalidInput(
        unknown.map((field) => ({
          code: "unknown_field",
          field,
          message: `${field} is not a supported input field.`,
        })),
      );
    const issues = validateTableData(candidate.data);
    if (issues.length > 0) return invalidInput(issues);
    if (candidate.spec !== undefined) {
      const specIssues = validateTableSpec(candidate.spec, true);
      if (specIssues.length > 0) return invalidInput(specIssues);
    }
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
        valueType: { format: "tool.io/table", type: "object" },
      },
      {
        id: "spec",
        label: "Table specification",
        required: false,
        valueType: { format: "tool.io/table-spec", type: "object" },
      },
    ],
    outputs: [
      {
        id: "document",
        label: "Table document",
        valueType: { format: "tool.io/table-document", type: "object" },
      },
    ],
  },
  title: "Table",
});

export const runTable = tableTool.execute;
export default tableTool;
