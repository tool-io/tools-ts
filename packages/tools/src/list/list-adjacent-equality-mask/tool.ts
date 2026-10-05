import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly items: readonly string[] };
export type Output = { readonly equalToPrevious: readonly boolean[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["items"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equalToPrevious: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["equalToPrevious"],
} as const;
/** Mark exact string equality with the preceding list item; the first position is always false. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { items } = request;
  const compute = (): Output => {
    return {
      equalToPrevious: items.map((v, i) => i > 0 && v === items[i - 1]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { items: ["a", "a", "b", "b"] },
  output: { equalToPrevious: [false, true, false, true] },
} satisfies ToolExample<Input, Output>;
export const listAdjacentEqualityMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-adjacent-equality-mask",
    title: "List Adjacent Equality Mask Tool",
    description:
      "Mark exact string equality with the preceding list item; the first position is always false.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        items: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["items"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equalToPrevious: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["equalToPrevious"],
    },
    ports: {
      inputs: [
        {
          id: "items",
          label: "Items",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "equalToPrevious",
          label: "Equal To Previous",
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
    },
  },
  calculate,
});
export const run = listAdjacentEqualityMaskTool.execute;
export default listAdjacentEqualityMaskTool;
