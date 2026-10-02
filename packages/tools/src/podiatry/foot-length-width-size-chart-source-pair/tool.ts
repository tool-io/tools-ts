import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly width: number;
  readonly lengthUnit: string;
  readonly chartUnit: string;
  readonly chartId: string;
  readonly edition: string;
};
export type Output = {
  readonly unitsMatch: boolean;
  readonly key: string;
  readonly aspectRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", exclusiveMinimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
    lengthUnit: { type: "string", maxLength: 8192 },
    chartUnit: { type: "string", maxLength: 8192 },
    chartId: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: [
    "length",
    "width",
    "lengthUnit",
    "chartUnit",
    "chartId",
    "edition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitsMatch: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
    aspectRatio: { type: "number" },
  },
  required: ["unitsMatch", "key", "aspectRatio"],
} as const;
/** Retain supplied chart/source and unit context without selecting a shoe size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width, lengthUnit, chartUnit, chartId, edition } = request;
  const compute = (): Output => {
    H.positive(length);
    H.positive(width);
    H.domain(
      chartId.length > 0 &&
        edition.length > 0 &&
        lengthUnit.length > 0 &&
        chartUnit.length > 0,
    );
    return {
      unitsMatch: lengthUnit === chartUnit,
      key: JSON.stringify([chartId, edition, chartUnit]),
      aspectRatio: length / width,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    length: 250,
    width: 100,
    lengthUnit: "mm",
    chartUnit: "mm",
    chartId: "chart-A",
    edition: "2025",
  },
  output: {
    unitsMatch: true,
    key: '["chart-A","2025","mm"]',
    aspectRatio: 2.5,
  },
} satisfies ToolExample<Input, Output>;
export const footLengthWidthSizeChartSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/foot-length-width-size-chart-source-pair",
    title: "Foot Length Width Size Chart Source Pair Tool",
    description:
      "Retain supplied chart/source and unit context without selecting a shoe size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", exclusiveMinimum: 0 },
        width: { type: "number", exclusiveMinimum: 0 },
        lengthUnit: { type: "string", maxLength: 8192 },
        chartUnit: { type: "string", maxLength: 8192 },
        chartId: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
      },
      required: [
        "length",
        "width",
        "lengthUnit",
        "chartUnit",
        "chartId",
        "edition",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitsMatch: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
        aspectRatio: { type: "number" },
      },
      required: ["unitsMatch", "key", "aspectRatio"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lengthUnit",
          label: "Length Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "chartUnit",
          label: "Chart Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "chartId",
          label: "Chart Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "unitsMatch",
          label: "Units Match",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
        {
          id: "aspectRatio",
          label: "Aspect Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = footLengthWidthSizeChartSourcePairTool.execute;
export default footLengthWidthSizeChartSourcePairTool;
