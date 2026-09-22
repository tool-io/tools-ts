import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly columnsPerRow: number;
  readonly firstIndex: number;
};
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    columnsPerRow: { type: "integer", minimum: 1 },
    firstIndex: { type: "integer" },
  },
  required: ["row", "column", "columnsPerRow", "firstIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" } },
  required: ["index"],
} as const;
/** Flatten supplied zero-based storage row/column coordinates with an explicit index origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, columnsPerRow, firstIndex } = request;
  const compute = (): Output => {
    H.integer(row, 0);
    H.integer(columnsPerRow, 1);
    H.integer(column, 0, columnsPerRow - 1);
    return {
      index: Number(
        BigInt(row) * BigInt(columnsPerRow) +
          BigInt(column) +
          BigInt(firstIndex),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 3, columnsPerRow: 10, firstIndex: 1 },
  output: { index: 24 },
} satisfies ToolExample<Input, Output>;
export const storagePositionIndexOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/storage-position-index-offset",
    title: "Storage Position Index Offset Tool",
    description:
      "Flatten supplied zero-based storage row/column coordinates with an explicit index origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        columnsPerRow: { type: "integer", minimum: 1 },
        firstIndex: { type: "integer" },
      },
      required: ["row", "column", "columnsPerRow", "firstIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer" } },
      required: ["index"],
    },
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
        {
          id: "columnsPerRow",
          label: "Columns Per Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = storagePositionIndexOffsetTool.execute;
export default storagePositionIndexOffsetTool;
