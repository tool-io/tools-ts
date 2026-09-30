import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly length: number;
  readonly paverWidth: number;
  readonly paverLength: number;
};
export type Output = {
  readonly columns: number;
  readonly rows: number;
  readonly cutPositions: number;
  readonly totalPositions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", exclusiveMinimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
    paverWidth: { type: "number", exclusiveMinimum: 0 },
    paverLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["width", "length", "paverWidth", "paverLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    columns: { type: "integer" },
    rows: { type: "integer" },
    cutPositions: { type: "integer" },
    totalPositions: { type: "integer" },
  },
  required: ["columns", "rows", "cutPositions", "totalPositions"],
} as const;
/** Count rectangular grid positions that require a cut on the right or far border; no reuse or joint width assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, length, paverWidth, paverLength } = request;
  const compute = (): Output => {
    H.positive(width);
    H.positive(length);
    H.positive(paverWidth);
    H.positive(paverLength);
    return {
      columns: Math.ceil(width / paverWidth),
      rows: Math.ceil(length / paverLength),
      cutPositions:
        (width % paverWidth === 0 ? 0 : Math.ceil(length / paverLength)) +
        (length % paverLength === 0 ? 0 : Math.ceil(width / paverWidth)) -
        (width % paverWidth !== 0 && length % paverLength !== 0 ? 1 : 0),
      totalPositions:
        Math.ceil(width / paverWidth) * Math.ceil(length / paverLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 10, length: 10, paverWidth: 3, paverLength: 3 },
  output: { columns: 4, rows: 4, cutPositions: 7, totalPositions: 16 },
} satisfies ToolExample<Input, Output>;
export const patioPaverCutBorderCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/patio-paver-cut-border-count",
    title: "Patio Paver Cut Border Count Tool",
    description:
      "Count rectangular grid positions that require a cut on the right or far border; no reuse or joint width assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", exclusiveMinimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
        paverWidth: { type: "number", exclusiveMinimum: 0 },
        paverLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["width", "length", "paverWidth", "paverLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        columns: { type: "integer" },
        rows: { type: "integer" },
        cutPositions: { type: "integer" },
        totalPositions: { type: "integer" },
      },
      required: ["columns", "rows", "cutPositions", "totalPositions"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paverWidth",
          label: "Paver Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paverLength",
          label: "Paver Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "columns", label: "Columns", valueType: { type: "integer" } },
        { id: "rows", label: "Rows", valueType: { type: "integer" } },
        {
          id: "cutPositions",
          label: "Cut Positions",
          valueType: { type: "integer" },
        },
        {
          id: "totalPositions",
          label: "Total Positions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = patioPaverCutBorderCountTool.execute;
export default patioPaverCutBorderCountTool;
