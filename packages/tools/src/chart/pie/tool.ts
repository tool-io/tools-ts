import type { ToolExample } from "../../core/example.js";
import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
} from "../../core/result.js";
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
  tableField,
} from "../specialized.js";

export type PieChartInput = {
  readonly category: string;
  readonly data: TableData;
  readonly donut?: boolean;
  readonly legendPosition?: "bottom" | "left" | "right" | "top";
  readonly showValues?: boolean;
  readonly title?: string;
  readonly value: string;
};
export type PieChartOutput = { readonly document: ChartDocument };

export const createPieChart = (input: PieChartInput): ChartDocument => {
  const spec: ChartSpec = {
    encoding: {
      category: { field: input.category },
      theta: { field: input.value },
    },
    kind: "tool.io/chart-spec",
    legend: { position: input.legendPosition ?? "right" },
    options: { showValues: input.showValues ?? false },
    ...(input.title ? { title: input.title } : {}),
    type: input.donut ? "donut" : "pie",
    version: 1,
  };
  return createChartDocument(input.data, spec);
};

const negativeValueIssues = (input: PieChartInput): readonly ToolIssue[] => {
  const field = tableField(input.data, input.value);
  if (!field) return [];
  const column = input.data.schema.fields.indexOf(field);
  const negative = input.data.rows.findIndex((row) => {
    const value = row[column];
    return value !== null && Number(value) < 0;
  });
  return negative < 0
    ? []
    : [
        {
          code: "negative_pie_value",
          field: "value",
          message: `Pie-chart values cannot be negative (row ${negative + 1}).`,
        },
      ];
};

const data: TableData = {
  kind: "tool.io/table",
  rows: [
    ["Android", 71],
    ["iOS", 28],
    ["Other", 1],
  ],
  schema: {
    fields: [
      { dataType: { kind: "string" }, id: "platform", nullable: false },
      {
        dataType: { bits: 32, kind: "integer", signed: false },
        id: "share",
        nullable: false,
      },
    ],
  },
  version: 1,
};

export const pieChartExample = {
  input: {
    category: "platform",
    data,
    title: "Platform share",
    value: "share",
  },
  output: {
    document: createPieChart({
      category: "platform",
      data,
      title: "Platform share",
      value: "share",
    }),
  },
} satisfies ToolExample<PieChartInput, PieChartOutput>;

export const pieChartTool = defineTool<PieChartInput, PieChartOutput>({
  contractVersion: 1,
  description:
    "Create a portable pie- or donut-chart document from a category column and nonnegative numeric values in tool.io tabular data.",
  discovery: {
    aliases: ["donut chart", "pie graph"],
    collections: ["data"],
    keywords: ["category", "chart", "donut", "pie", "proportion", "share"],
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
          "category",
          "data",
          "donut",
          "legendPosition",
          "showValues",
          "title",
          "value",
        ],
        [
          { input: "category", required: true },
          { input: "value", numeric: true, required: true },
        ],
      ),
      ...optionTypeIssues(value, ["title"], ["donut", "showValues"], {
        legendPosition: ["bottom", "left", "right", "top"],
      }),
    ];
    if (issues.length > 0) return invalidInput(issues);
    const input = value as unknown as PieChartInput;
    const valueIssues = negativeValueIssues(input);
    return valueIssues.length > 0
      ? invalidInput(valueIssues)
      : toolSuccess({ document: createPieChart(input) });
  },
  id: "chart/pie",
  inputSchema: {
    additionalProperties: false,
    properties: {
      category: { type: "string" },
      data: { additionalProperties: true, type: "object" },
      donut: { type: "boolean" },
      legendPosition: {
        enum: ["bottom", "left", "right", "top"],
        type: "string",
      },
      showValues: { type: "boolean" },
      title: { type: "string" },
      value: { type: "string" },
    },
    required: ["category", "data", "value"],
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
        id: "category",
        label: "Category field",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "value",
        label: "Value field",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "document",
        label: "Pie chart document",
        valueType: { format: "tool.io/chart-document", type: "object" },
      },
    ],
  },
  title: "Pie Chart",
});

export const runPieChart = pieChartTool.execute;
export default pieChartTool;
