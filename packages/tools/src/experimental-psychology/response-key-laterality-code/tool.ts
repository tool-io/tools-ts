import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly key: string;
  readonly leftKeys: readonly string[];
  readonly rightKeys: readonly string[];
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    leftKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    rightKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["key", "leftKeys", "rightKeys"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Classify a supplied key using explicit disjoint response-key inventories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { key, leftKeys, rightKeys } = request;
  const compute = (): Output => {
    H.domain(!leftKeys.some((x) => rightKeys.includes(x)));
    return {
      label: leftKeys.includes(key)
        ? "left"
        : rightKeys.includes(key)
          ? "right"
          : "unmapped",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { key: "f", leftKeys: ["f"], rightKeys: ["j"] },
  output: { label: "left" },
} satisfies ToolExample<Input, Output>;
export const responseKeyLateralityCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/response-key-laterality-code",
    title: "Response Key Laterality Code Tool",
    description:
      "Classify a supplied key using explicit disjoint response-key inventories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "string", maxLength: 8192 },
        leftKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        rightKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["key", "leftKeys", "rightKeys"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "key",
          label: "Key",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "leftKeys",
          label: "Left Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "rightKeys",
          label: "Right Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = responseKeyLateralityCodeTool.execute;
export default responseKeyLateralityCodeTool;
