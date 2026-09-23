import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowIndex: number;
  readonly rowOrigin: number;
  readonly rowCount: number;
};
export type Output = {
  readonly zeroBasedRow: number;
  readonly oddRow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowIndex: { type: "integer" },
    rowOrigin: { type: "integer" },
    rowCount: { type: "integer", minimum: 1 },
  },
  required: ["rowIndex", "rowOrigin", "rowCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroBasedRow: { type: "integer" },
    oddRow: { type: "boolean" },
  },
  required: ["zeroBasedRow", "oddRow"],
} as const;
/** Report zero-based row parity under an explicit origin and plate row count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowIndex, rowOrigin, rowCount } = request;
  const compute = (): Output => {
    H.domain(rowOrigin === 0 || rowOrigin === 1);
    H.integer(rowCount, 1);
    H.integer(rowIndex, rowOrigin, rowOrigin + rowCount - 1);
    return {
      zeroBasedRow: rowIndex - rowOrigin,
      oddRow: (rowIndex - rowOrigin) % 2 === 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowIndex: 2, rowOrigin: 1, rowCount: 8 },
  output: { zeroBasedRow: 1, oddRow: true },
} satisfies ToolExample<Input, Output>;
export const plateWellRowParityBitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/plate-well-row-parity-bit",
    title: "Plate Well Row Parity Bit Tool",
    description:
      "Report zero-based row parity under an explicit origin and plate row count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowIndex: { type: "integer" },
        rowOrigin: { type: "integer" },
        rowCount: { type: "integer", minimum: 1 },
      },
      required: ["rowIndex", "rowOrigin", "rowCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroBasedRow: { type: "integer" },
        oddRow: { type: "boolean" },
      },
      required: ["zeroBasedRow", "oddRow"],
    },
    ports: {
      inputs: [
        {
          id: "rowIndex",
          label: "Row Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowOrigin",
          label: "Row Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowCount",
          label: "Row Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "zeroBasedRow",
          label: "Zero Based Row",
          valueType: { type: "integer" },
        },
        { id: "oddRow", label: "Odd Row", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = plateWellRowParityBitTool.execute;
export default plateWellRowParityBitTool;
