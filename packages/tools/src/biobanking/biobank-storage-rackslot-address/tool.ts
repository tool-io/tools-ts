import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rack: number;
  readonly box: number;
  readonly row: number;
  readonly column: number;
  readonly boxes: number;
  readonly rows: number;
  readonly columns: number;
};
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rack: { type: "integer", minimum: 0 },
    box: { type: "integer", minimum: 0 },
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    boxes: { type: "integer", minimum: 1 },
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
  },
  required: ["rack", "box", "row", "column", "boxes", "rows", "columns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" } },
  required: ["index"],
} as const;
/** Flatten an explicitly dimensioned zero-based rack/box/row/column address exactly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rack, box, row, column, boxes, rows, columns } = request;
  const compute = (): Output => {
    H.integer(rack, 0);
    H.integer(boxes, 1);
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(box, 0, boxes - 1);
    H.integer(row, 0, rows - 1);
    H.integer(column, 0, columns - 1);
    return {
      index: Number(
        ((BigInt(rack) * BigInt(boxes) + BigInt(box)) * BigInt(rows) +
          BigInt(row)) *
          BigInt(columns) +
          BigInt(column),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rack: 1, box: 2, row: 3, column: 4, boxes: 5, rows: 8, columns: 10 },
  output: { index: 594 },
} satisfies ToolExample<Input, Output>;
export const biobankStorageRackslotAddressTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-storage-rackslot-address",
    title: "Biobank Storage Rackslot Address Tool",
    description:
      "Flatten an explicitly dimensioned zero-based rack/box/row/column address exactly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rack: { type: "integer", minimum: 0 },
        box: { type: "integer", minimum: 0 },
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        boxes: { type: "integer", minimum: 1 },
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
      },
      required: ["rack", "box", "row", "column", "boxes", "rows", "columns"],
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
          id: "rack",
          label: "Rack",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "box",
          label: "Box",
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
          id: "boxes",
          label: "Boxes",
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
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = biobankStorageRackslotAddressTool.execute;
export default biobankStorageRackslotAddressTool;
