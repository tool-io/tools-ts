import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly items: number;
  readonly leading: boolean;
  readonly trailing: boolean;
};
export type Output = { readonly separators: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: { type: "integer", minimum: 0 },
    leading: { type: "boolean" },
    trailing: { type: "boolean" },
  },
  required: ["items", "leading", "trailing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { separators: { type: "integer" } },
  required: ["separators"],
} as const;
/** Calculate list separator between items count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { items, leading, trailing } = input;
  const compute = (): Output => {
    H.integer(items, 0);
    return {
      separators:
        items === 0 ? 0 : items - 1 + (leading ? 1 : 0) + (trailing ? 1 : 0),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { items: 4, leading: false, trailing: false },
  output: { separators: 3 },
} satisfies ToolExample<Input, Output>;
export const listSeparatorBetweenItemsCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-separator-between-items-count",
    title: "List Separator Between Items Count Tool",
    description:
      "Calculate list separator between items count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        items: { type: "integer", minimum: 0 },
        leading: { type: "boolean" },
        trailing: { type: "boolean" },
      },
      required: ["items", "leading", "trailing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { separators: { type: "integer" } },
      required: ["separators"],
    },
    ports: {
      inputs: [
        {
          id: "items",
          label: "Items",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leading",
          label: "Leading",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "trailing",
          label: "Trailing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "separators",
          label: "Separators",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listSeparatorBetweenItemsCountTool.execute;
export default listSeparatorBetweenItemsCountTool;
