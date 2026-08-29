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

export type LineChartInput = {
  readonly connectNulls?: boolean;
  readonly data: TableData;
  readonly missingValues?: "gap" | "omit" | "zero";
  readonly series?: string;
  readonly title?: string;
  readonly x: string;
  readonly xLabel?: string;
  readonly y: string;
  readonly yLabel?: string;
};
export type LineChartOutput = { readonly document: ChartDocument };

export const createLineChart = (input: LineChartInput): ChartDocument => {
  const spec: ChartSpec = {
    encoding: {
      ...(input.series ? { series: { field: input.series } } : {}),
      x: { field: input.x, ...(input.xLabel ? { label: input.xLabel } : {}) },
      y: { field: input.y, ...(input.yLabel ? { label: input.yLabel } : {}) },
    },
    kind: "tool.io/chart-spec",
    options: {
      connectNulls: input.connectNulls ?? false,
      missingValues: input.missingValues ?? "gap",
    },
    ...(input.title ? { title: input.title } : {}),
    type: "line",
    version: 1,
  };
  return createChartDocument(input.data, spec);
};

const data: TableData = {
  kind: "tool.io/table",
  rows: [
    [2022, 12],
    [2023, 18],
    [2024, 31],
  ],
  schema: {
    fields: [
      {
        dataType: { bits: 32, kind: "integer", signed: false },
        id: "year",
        nullable: false,
      },
      {
        dataType: { bits: 32, kind: "integer", signed: false },
        id: "value",
        nullable: false,
      },
    ],
  },
  version: 1,
};

export const lineChartExample = {
  input: { data, title: "Annual observations", x: "year", y: "value" },
  output: {
    document: createLineChart({
      data,
      title: "Annual observations",
      x: "year",
      y: "value",
    }),
  },
} satisfies ToolExample<LineChartInput, LineChartOutput>;

export const lineChartTool = defineTool<LineChartInput, LineChartOutput>({
  contractVersion: 1,
  description:
    "Create a portable line-chart document for ordered observations, with optional series grouping and explicit missing-value behavior.",
  discovery: {
    aliases: ["line graph", "time series chart"],
    collections: ["data"],
    keywords: ["chart", "line", "series", "trend", "visualization"],
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
          "connectNulls",
          "data",
          "missingValues",
          "series",
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
      ...optionTypeIssues(
        value,
        ["title", "xLabel", "yLabel"],
        ["connectNulls"],
        { missingValues: ["gap", "omit", "zero"] },
      ),
    ];
    return issues.length > 0
      ? invalidInput(issues)
      : toolSuccess({
          document: createLineChart(value as unknown as LineChartInput),
        });
  },
  id: "chart/line",
  inputSchema: {
    additionalProperties: false,
    properties: {
      connectNulls: { type: "boolean" },
      data: { additionalProperties: true, type: "object" },
      missingValues: { enum: ["gap", "omit", "zero"], type: "string" },
      series: { type: "string" },
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
        label: "Line chart document",
        valueType: { format: "tool.io/chart-document", type: "object" },
      },
    ],
  },
  title: "Line Chart",
});

export const runLineChart = lineChartTool.execute;
export default lineChartTool;
