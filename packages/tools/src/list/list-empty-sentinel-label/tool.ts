import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly itemsJson: string };
export type Output = { readonly label: string; readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { itemsJson: { type: "string", maxLength: 8192 } },
  required: ["itemsJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    count: { type: "integer" },
  },
  required: ["label", "count"],
} as const;
/** Identify a bounded JSON list's empty/nonempty state without confusing an explicit null item with the empty list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemsJson } = request;
  const compute = (): Output => {
    const a = H.list(H.parseJson(itemsJson));
    return {
      label: a.length === 0 ? "empty-list" : "nonempty-list",
      count: a.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemsJson: "[null]" },
  output: { label: "nonempty-list", count: 1 },
} satisfies ToolExample<Input, Output>;
export const listEmptySentinelLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-empty-sentinel-label",
    title: "List Empty Sentinel Label Tool",
    description:
      "Identify a bounded JSON list's empty/nonempty state without confusing an explicit null item with the empty list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { itemsJson: { type: "string", maxLength: 8192 } },
      required: ["itemsJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        count: { type: "integer" },
      },
      required: ["label", "count"],
    },
    ports: {
      inputs: [
        {
          id: "itemsJson",
          label: "Items Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listEmptySentinelLabelTool.execute;
export default listEmptySentinelLabelTool;
