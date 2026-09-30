import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly insertedAt: number;
  readonly selected: number;
  readonly deletedAt: number;
};
export type Output = { readonly index: number; readonly removed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    insertedAt: { type: "integer", minimum: 0 },
    selected: { type: "integer", minimum: 0 },
    deletedAt: { type: "integer", minimum: 0 },
  },
  required: ["length", "insertedAt", "selected", "deletedAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" }, removed: { type: "boolean" } },
  required: ["index", "removed"],
} as const;
/** Calculate list insert delete index roundtrip from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, insertedAt, selected, deletedAt } = input;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(insertedAt, 0, length);
    H.integer(selected, 0, length - 1);
    H.integer(deletedAt, 0, length);
    const shifted = selected + (selected >= insertedAt ? 1 : 0),
      removed = shifted === deletedAt;
    return {
      index: removed ? -1 : shifted - (shifted > deletedAt ? 1 : 0),
      removed,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 5, insertedAt: 2, selected: 3, deletedAt: 2 },
  output: { index: 3, removed: false },
} satisfies ToolExample<Input, Output>;
export const listInsertDeleteIndexRoundtripTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-insert-delete-index-roundtrip",
    title: "List Insert Delete Index Roundtrip Tool",
    description:
      "Calculate list insert delete index roundtrip from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        insertedAt: { type: "integer", minimum: 0 },
        selected: { type: "integer", minimum: 0 },
        deletedAt: { type: "integer", minimum: 0 },
      },
      required: ["length", "insertedAt", "selected", "deletedAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer" }, removed: { type: "boolean" } },
      required: ["index", "removed"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "insertedAt",
          label: "Inserted At",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "deletedAt",
          label: "Deleted At",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "removed", label: "Removed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = listInsertDeleteIndexRoundtripTool.execute;
export default listInsertDeleteIndexRoundtripTool;
