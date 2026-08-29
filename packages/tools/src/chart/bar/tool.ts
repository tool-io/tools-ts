import type { ToolExample } from "../../core/example.js";
import { defineTool } from "../../core/definition.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import type { TableData } from "../../table/definition.js";
import {
  createChartDocument,
  type ChartDocument,
  type ChartSpec,
} from "../definition.js";
import {
  isChartInput,
  optionTypeIssues,
  specializedChartIssues,
} from "../specialized.js";

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
    kind: "tool.io/chart-spec",
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
  kind: "tool.io/table",
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
    "Create a portable bar-chart document from two columns of tool.io tabular data.",
  discovery: {
    aliases: ["bar graph"],
    collections: ["data"],
    keywords: ["bar", "chart", "graph", "visualization"],
  },
  execution: { kind: "pure" },
  execute: (value) => {
    if (!isChartInput(value))
      return invalidInput([
        {
          code: "object_required",
          field: "",
          message: "Input must be an object.",
        },
      ]);
    const issues = [
      ...specializedChartIssues(
        value,
        [
          "data",
          "orientation",
          "series",
          "stacked",
          "title",
          "x",
          "xLabel",
          "y",
          "yLabel",
        ],
        [
          { input: "x", required: true },
          { input: "y", numeric: true, required: true },
          { input: "series" },
        ],
      ),
      ...optionTypeIssues(value, ["title", "xLabel", "yLabel"], ["stacked"], {
        orientation: ["horizontal", "vertical"],
      }),
    ];
    if (issues.length > 0) return invalidInput(issues);
    return toolSuccess({
      document: createBarChart(value as unknown as BarChartInput),
    });
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
        required: true,
        valueType: { format: "tool.io/table", type: "object" },
      },
      {
        id: "x",
        label: "X field",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "y",
        label: "Y field",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "document",
        label: "Bar chart document",
        valueType: { format: "tool.io/chart-document", type: "object" },
      },
    ],
  },
  title: "Bar Chart",
});

export const runBarChart = barChartTool.execute;
export default barChartTool;
