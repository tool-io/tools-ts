import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rack: number;
  readonly row: number;
  readonly column: number;
  readonly rows: number;
  readonly columns: number;
};
export type Output = {
  readonly zeroBasedPosition: number;
  readonly oneBasedPosition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rack: { type: "integer", minimum: 0 },
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
  },
  required: ["rack", "row", "column", "rows", "columns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroBasedPosition: { type: "integer" },
    oneBasedPosition: { type: "integer" },
  },
  required: ["zeroBasedPosition", "oneBasedPosition"],
} as const;
/** Zero-based rack/row/column addressing with explicit rack dimensions and row-major ordering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rack, row, column, rows, columns } = request;
  const compute = (): Output => {
    H.integer(rack, 0);
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(row, 0, rows - 1);
    H.integer(column, 0, columns - 1);
    return {
      zeroBasedPosition: rack * rows * columns + row * columns + column,
      oneBasedPosition: rack * rows * columns + row * columns + column + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rack: 1, row: 2, column: 3, rows: 4, columns: 5 },
  output: { zeroBasedPosition: 33, oneBasedPosition: 34 },
} satisfies ToolExample<Input, Output>;
export const histologySlideRackPositionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/histology-slide-rack-position-code",
    title: "Histology Slide Rack Position Code Tool",
    description:
      "Zero-based rack/row/column addressing with explicit rack dimensions and row-major ordering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rack: { type: "integer", minimum: 0 },
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
      },
      required: ["rack", "row", "column", "rows", "columns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroBasedPosition: { type: "integer" },
        oneBasedPosition: { type: "integer" },
      },
      required: ["zeroBasedPosition", "oneBasedPosition"],
    },
    ports: {
      inputs: [
        {
          id: "rack",
          label: "Rack",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rows",
          label: "Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columns",
          label: "Columns",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "zeroBasedPosition",
          label: "Zero Based Position",
          valueType: { type: "integer" },
        },
        {
          id: "oneBasedPosition",
          label: "One Based Position",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = histologySlideRackPositionCodeTool.execute;
export default histologySlideRackPositionCodeTool;
