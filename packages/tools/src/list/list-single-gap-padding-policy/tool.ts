import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly string[];
  readonly index: number;
  readonly value: string;
  readonly fill: string;
};
export type Output = {
  readonly values: readonly string[];
  readonly padding: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    index: { type: "integer", minimum: 0, maximum: 255 },
    value: { type: "string", maxLength: 8192 },
    fill: { type: "string", maxLength: 8192 },
  },
  required: ["values", "index", "value", "fill"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    padding: { type: "integer" },
  },
  required: ["values", "padding"],
} as const;
/** Calculate list single gap padding policy from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { values, index, value, fill } = input;
  const compute = (): Output => {
    H.integer(index, 0, 255);
    const result = [...values];
    while (result.length < index) result.push(fill);
    const padding = Math.max(0, index - values.length);
    result[index] = value;
    return { values: result, padding };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { values: ["a"], index: 3, value: "z", fill: "_" },
  output: { values: ["a", "_", "_", "z"], padding: 2 },
} satisfies ToolExample<Input, Output>;
export const listSingleGapPaddingPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-single-gap-padding-policy",
    title: "List Single Gap Padding Policy Tool",
    description:
      "Calculate list single gap padding policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        index: { type: "integer", minimum: 0, maximum: 255 },
        value: { type: "string", maxLength: 8192 },
        fill: { type: "string", maxLength: 8192 },
      },
      required: ["values", "index", "value", "fill"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        padding: { type: "integer" },
      },
      required: ["values", "padding"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fill",
          label: "Fill",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "values",
          label: "Values",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "padding", label: "Padding", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listSingleGapPaddingPolicyTool.execute;
export default listSingleGapPaddingPolicyTool;
