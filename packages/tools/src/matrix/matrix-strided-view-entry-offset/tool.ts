import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: number;
  readonly row: number;
  readonly column: number;
  readonly rowStride: number;
  readonly columnStride: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "integer", minimum: 0 },
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    rowStride: { type: "integer" },
    columnStride: { type: "integer" },
  },
  required: ["base", "row", "column", "rowStride", "columnStride"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "integer" } },
  required: ["offset"],
} as const;
/** Calculate matrix strided view entry offset from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { base, row, column, rowStride, columnStride } = input;
  const compute = (): Output => {
    H.integer(base, 0);
    H.integer(row, 0);
    H.integer(column, 0);
    const offset = base + row * rowStride + column * columnStride;
    H.integer(offset, 0);
    return { offset };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { base: 10, row: 2, column: 3, rowStride: 8, columnStride: 1 },
  output: { offset: 29 },
} satisfies ToolExample<Input, Output>;
export const matrixStridedViewEntryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-strided-view-entry-offset",
    title: "Matrix Strided View Entry Offset Tool",
    description:
      "Calculate matrix strided view entry offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "integer", minimum: 0 },
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        rowStride: { type: "integer" },
        columnStride: { type: "integer" },
      },
      required: ["base", "row", "column", "rowStride", "columnStride"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "integer" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "base",
          label: "Base",
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
          id: "rowStride",
          label: "Row Stride",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnStride",
          label: "Column Stride",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = matrixStridedViewEntryOffsetTool.execute;
export default matrixStridedViewEntryOffsetTool;
