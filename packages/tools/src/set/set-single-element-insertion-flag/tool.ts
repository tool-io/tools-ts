import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elements: readonly string[];
  readonly element: string;
};
export type Output = {
  readonly changed: boolean;
  readonly result: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elements: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    element: { type: "string", maxLength: 8192 },
  },
  required: ["elements", "element"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changed: { type: "boolean" },
    result: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["changed", "result"],
} as const;
/** Insert one string into a finite set while preserving first-occurrence order and reporting whether membership changed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elements, element } = request;
  const compute = (): Output => {
    const result = [...new Set(elements)],
      changed = !result.includes(element);
    if (changed) result.push(element);
    return { changed, result };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elements: ["a", "b"], element: "c" },
  output: { changed: true, result: ["a", "b", "c"] },
} satisfies ToolExample<Input, Output>;
export const setSingleElementInsertionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-single-element-insertion-flag",
    title: "Set Single Element Insertion Flag Tool",
    description:
      "Insert one string into a finite set while preserving first-occurrence order and reporting whether membership changed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elements: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        element: { type: "string", maxLength: 8192 },
      },
      required: ["elements", "element"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changed: { type: "boolean" },
        result: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["changed", "result"],
    },
    ports: {
      inputs: [
        {
          id: "elements",
          label: "Elements",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "element",
          label: "Element",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        {
          id: "result",
          label: "Result",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = setSingleElementInsertionFlagTool.execute;
export default setSingleElementInsertionFlagTool;
