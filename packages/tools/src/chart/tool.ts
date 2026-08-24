import type { ToolExample } from "../core/example.js";
import { defineTool } from "../core/definition.js";
import { invalidInput, toolSuccess } from "../core/result.js";
import type { TableData } from "../table/definition.js";
import { validateTableData } from "../table/definition.js";
import {
  createChartDocument,
  type ChartDocument,
  type ChartSpec,
} from "./definition.js";

export type ChartToolInput = {
  readonly data: TableData;
  readonly spec: ChartSpec;
};
export type ChartToolOutput = { readonly document: ChartDocument };

const exampleData: TableData = {
  kind: "toolio/table",
  rows: [
    ["20:00", 12],
    ["21:00", 72],
  ],
  schema: {
    fields: [
      { dataType: { kind: "string" }, id: "hour", nullable: false },
      {
        dataType: { bits: 32, kind: "integer", signed: false },
        id: "strike-count",
        nullable: false,
      },
    ],
  },
  version: 1,
};
const exampleSpec: ChartSpec = {
  encoding: {
    x: { field: "hour", label: "Hour (UTC)" },
    y: { field: "strike-count", label: "Lightning strikes" },
  },
  kind: "toolio/chart-spec",
  title: "Lightning strikes by hour",
  type: "bar",
  version: 1,
};

export const chartExample = {
  input: { data: exampleData, spec: exampleSpec },
  output: { document: createChartDocument(exampleData, exampleSpec) },
} satisfies ToolExample<ChartToolInput, ChartToolOutput>;

export const chartTool = defineTool<ChartToolInput, ChartToolOutput>({
  contractVersion: 1,
  description:
    "Create a renderer-independent chart document from portable tabular data and a declarative chart specification.",
  discovery: {
    aliases: ["graph"],
    collections: ["data"],
    keywords: ["bar chart", "chart", "data", "graph", "visualization"],
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
    const candidate = input as Partial<ChartToolInput>;
    const issues = validateTableData(candidate.data);
    if (issues.length > 0) return invalidInput(issues);
    if (
      typeof candidate.spec !== "object" ||
      candidate.spec === null ||
      candidate.spec.kind !== "toolio/chart-spec" ||
      candidate.spec.version !== 1 ||
      typeof candidate.spec.type !== "string" ||
      candidate.spec.type.length === 0 ||
      typeof candidate.spec.encoding !== "object" ||
      candidate.spec.encoding === null ||
      Array.isArray(candidate.spec.encoding)
    )
      return invalidInput([
        {
          code: "invalid_chart_spec",
          field: "spec",
          message: "Enter a Tool.io ChartSpec Version 1 value.",
        },
      ]);
    const encodingValues = Object.values(candidate.spec.encoding).flatMap(
      (encoding) => (Array.isArray(encoding) ? encoding : [encoding]),
    );
    if (
      encodingValues.some(
        (encoding) =>
          typeof encoding !== "object" ||
          encoding === null ||
          typeof (encoding as { field?: unknown }).field !== "string" ||
          (encoding as { field: string }).field.length === 0,
      )
    )
      return invalidInput([
        {
          code: "invalid_chart_encoding",
          field: "spec.encoding",
          message: "Every chart encoding needs a non-empty field name.",
        },
      ]);
    return toolSuccess({
      document: createChartDocument(
        candidate.data as TableData,
        candidate.spec as ChartSpec,
      ),
    });
  },
  id: "chart",
  inputSchema: {
    additionalProperties: false,
    properties: {
      data: { additionalProperties: true, type: "object" },
      spec: { additionalProperties: true, type: "object" },
    },
    required: ["data", "spec"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { document: { additionalProperties: true, type: "object" } },
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
        label: "Chart specification",
        valueType: { format: "chart/spec", type: "object" },
      },
    ],
    outputs: [
      {
        id: "document",
        label: "Chart document",
        valueType: { format: "chart/document", type: "object" },
      },
    ],
  },
  title: "Chart",
});

export const runChart = chartTool.execute;
export default chartTool;
