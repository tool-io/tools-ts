import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly row: number; readonly size: number };
export type Output = { readonly column: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    size: { type: "integer", minimum: 1 },
  },
  required: ["row", "size"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { column: { type: "integer" } },
  required: ["column"],
} as const;
/** Compute matrix antidiagonal index crosswalk from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, size } = input;
  const compute = (): Output => {
    integer(size, 1);
    integer(row, 0, size - 1);
    return { column: size - 1 - row };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 1, size: 5 },
  output: { column: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixAntidiagonalIndexCrosswalkTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-antidiagonal-index-crosswalk",
  title: "Matrix Antidiagonal Index Crosswalk Tool",
  description:
    "Compute matrix antidiagonal index crosswalk from explicit bounded inputs.",
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
        id: "size",
        label: "Size",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "column", label: "Column", valueType: { type: "integer" } },
    ],
  },
});
export const run = matrixAntidiagonalIndexCrosswalkTool.execute;
export default matrixAntidiagonalIndexCrosswalkTool;
