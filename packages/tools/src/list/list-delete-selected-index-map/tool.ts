import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly deleted: readonly number[];
  readonly selected: number;
};
export type Output = { readonly newIndex: number; readonly removed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    deleted: { type: "array", maxItems: 256, items: { type: "integer" } },
    selected: { type: "integer", minimum: 0 },
  },
  required: ["length", "deleted", "selected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newIndex: { type: "integer" }, removed: { type: "boolean" } },
  required: ["newIndex", "removed"],
} as const;
/** Calculate list delete selected index map from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, deleted, selected } = input;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(selected, 0, length - 1);
    H.domain(new Set(deleted).size === deleted.length);
    deleted.forEach((x) => H.integer(x, 0, length - 1));
    const removed = deleted.includes(selected);
    return {
      newIndex: removed
        ? -1
        : selected - deleted.filter((x) => x < selected).length,
      removed,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 6, deleted: [1, 3], selected: 4 },
  output: { newIndex: 2, removed: false },
} satisfies ToolExample<Input, Output>;
export const listDeleteSelectedIndexMapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-delete-selected-index-map",
    title: "List Delete Selected Index Map Tool",
    description:
      "Calculate list delete selected index map from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        deleted: { type: "array", maxItems: 256, items: { type: "integer" } },
        selected: { type: "integer", minimum: 0 },
      },
      required: ["length", "deleted", "selected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newIndex: { type: "integer" },
        removed: { type: "boolean" },
      },
      required: ["newIndex", "removed"],
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
          id: "deleted",
          label: "Deleted",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "newIndex", label: "New Index", valueType: { type: "integer" } },
        { id: "removed", label: "Removed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = listDeleteSelectedIndexMapTool.execute;
export default listDeleteSelectedIndexMapTool;
