import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly order: number };
export type Output = {
  readonly rowIndices: readonly number[];
  readonly columnIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { order: { type: "integer", minimum: 1, maximum: 128 } },
  required: ["order"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    columnIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["rowIndices", "columnIndices"],
} as const;
/** Compute matrix leading principal border index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { order } = input;
  const compute = (): Output => {
    integer(order, 1, 128);
    return {
      rowIndices: [
        ...Array.from({ length: order - 1 }, (_, i) => i),
        ...Array.from({ length: order }, () => order - 1),
      ],
      columnIndices: [
        ...Array.from({ length: order - 1 }, () => order - 1),
        ...Array.from({ length: order }, (_, i) => i),
      ],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { order: 3 },
  output: { rowIndices: [0, 1, 2, 2, 2], columnIndices: [2, 2, 0, 1, 2] },
} satisfies ToolExample<Input, Output>;
export const matrixLeadingPrincipalBorderIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-leading-principal-border-index",
  title: "Matrix Leading Principal Border Index Tool",
  description:
    "Enumerate paired zero-based row and column addresses of a leading principal submatrix border, visiting the last column then the last row without duplicating the corner.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "order",
        label: "Order",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "rowIndices",
        label: "Row Indices",
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "columnIndices",
        label: "Column Indices",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = matrixLeadingPrincipalBorderIndexTool.execute;
export default matrixLeadingPrincipalBorderIndexTool;
