import type { ToolExample } from "../../core/example.js";
import { defineTool } from "../../core/definition.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import type { TableData } from "../../table/definition.js";
import { validateTableData } from "../../table/definition.js";
import {
  createChartDocument,
  type ChartDocument,
  type ChartSpec,
} from "../definition.js";

export type BarChartInput = {
  readonly data: TableData;
  readonly orientation?: "horizontal" | "vertical";
  readonly series?: string;
  readonly stacked?: boolean;
  readonly title?: string;
  readonly x: string;
  readonly xLabel?: string;
  readonly y: string;
  readonly yLabel?: string;
};
export type BarChartOutput = { readonly document: ChartDocument };

export const createBarChart = (input: BarChartInput): ChartDocument => {
  const spec: ChartSpec = {
    encoding: {
      ...(input.series ? { series: { field: input.series } } : {}),
      x: { field: input.x, ...(input.xLabel ? { label: input.xLabel } : {}) },
      y: { field: input.y, ...(input.yLabel ? { label: input.yLabel } : {}) },
    },
    kind: "toolio/chart-spec",
    options: {
      orientation: input.orientation ?? "vertical",
      stacked: input.stacked ?? false,
    },
    ...(input.title ? { title: input.title } : {}),
    type: "bar",
    version: 1,
  };
  return createChartDocument(input.data, spec);
};

const data: TableData = {
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

export const barChartExample = {
  input: {
    data,
    title: "Lightning strikes by hour",
    x: "hour",
    y: "strike-count",
  },
  output: {
    document: createBarChart({
      data,
      title: "Lightning strikes by hour",
      x: "hour",
      y: "strike-count",
    }),
  },
} satisfies ToolExample<BarChartInput, BarChartOutput>;

export const barChartTool = defineTool<BarChartInput, BarChartOutput>({
  contractVersion: 1,
  description:
    "Create a portable bar-chart document from two columns of Tool.io tabular data.",
  discovery: {
    aliases: ["bar graph"],
    collections: ["data"],
    keywords: ["bar", "chart", "graph", "visualization"],
  },
  execution: { kind: "pure" },
  execute: (value) => {
    if (typeof value !== "object" || value === null || Array.isArray(value))
      return invalidInput([
        {
          code: "object_required",
          field: "",
          message: "Input must be an object.",
        },
      ]);
    const input = value as Partial<BarChartInput>;
    const issues = validateTableData(input.data);
    if (issues.length > 0) return invalidInput(issues);
    if (!input.x || !input.y)
      return invalidInput([
        {
          code: "axes_required",
          field: !input.x ? "x" : "y",
          message: "Select x and y fields for the bar chart.",
        },
      ]);
    const fields = new Map(
      (input.data as TableData).schema.fields.map((field) => [field.id, field]),
    );
    const missing = [input.x, input.y, input.series].find(
      (field) => field !== undefined && !fields.has(field),
    );
    if (missing)
      return invalidInput([
        {
          code: "unknown_field",
          field: missing,
          message: `Field "${missing}" is not present in the table schema.`,
        },
      ]);
    const yField = fields.get(input.y);
    if (
      yField &&
      !["decimal", "float", "integer"].includes(yField.dataType.kind)
    )
      return invalidInput([
        {
          code: "numeric_y_required",
          field: input.y,
          message: "The bar-chart y field must be numeric.",
        },
      ]);
    return toolSuccess({ document: createBarChart(input as BarChartInput) });
  },
  id: "chart/bar",
  inputSchema: {
    additionalProperties: false,
    properties: {
      data: { additionalProperties: true, type: "object" },
      orientation: { enum: ["horizontal", "vertical"], type: "string" },
      series: { type: "string" },
      stacked: { type: "boolean" },
      title: { type: "string" },
      x: { type: "string" },
      xLabel: { type: "string" },
      y: { type: "string" },
      yLabel: { type: "string" },
    },
    required: ["data", "x", "y"],
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
      { id: "x", label: "X field", valueType: { type: "string" } },
      { id: "y", label: "Y field", valueType: { type: "string" } },
    ],
    outputs: [
      {
        id: "document",
        label: "Bar chart document",
        valueType: { format: "chart/document", type: "object" },
      },
    ],
  },
  title: "Bar Chart",
});

export const runBarChart = barChartTool.execute;
export default barChartTool;
