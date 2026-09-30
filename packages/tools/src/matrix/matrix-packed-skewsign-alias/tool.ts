import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly row: number; readonly column: number };
export type Output = {
  readonly storageRow: number;
  readonly storageColumn: number;
  readonly sign: number;
  readonly diagonal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
  },
  required: ["row", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storageRow: { type: "integer" },
    storageColumn: { type: "integer" },
    sign: { type: "integer" },
    diagonal: { type: "boolean" },
  },
  required: ["storageRow", "storageColumn", "sign", "diagonal"],
} as const;
/** Compute matrix packed skewsign alias from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, column } = input;
  const compute = (): Output => {
    integer(row);
    integer(column);
    return {
      storageRow: Math.min(row, column),
      storageColumn: Math.max(row, column),
      sign: row === column ? 0 : row < column ? 1 : -1,
      diagonal: row === column,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 3, column: 1 },
  output: { storageRow: 1, storageColumn: 3, sign: -1, diagonal: false },
} satisfies ToolExample<Input, Output>;
export const matrixPackedSkewsignAliasTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-packed-skewsign-alias",
  title: "Matrix Packed Skewsign Alias Tool",
  description:
    "Compute matrix packed skewsign alias from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
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
    ],
    outputs: [
      {
        id: "storageRow",
        label: "Storage Row",
        valueType: { type: "integer" },
      },
      {
        id: "storageColumn",
        label: "Storage Column",
        valueType: { type: "integer" },
      },
      { id: "sign", label: "Sign", valueType: { type: "integer" } },
      { id: "diagonal", label: "Diagonal", valueType: { type: "boolean" } },
    ],
  },
});
export const run = matrixPackedSkewsignAliasTool.execute;
export default matrixPackedSkewsignAliasTool;
