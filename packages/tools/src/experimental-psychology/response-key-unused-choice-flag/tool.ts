import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly key: string;
  readonly configuredKeys: readonly string[];
  readonly usedKeys: readonly string[];
};
export type Output = { readonly configured: boolean; readonly unused: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    configuredKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    usedKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["key", "configuredKeys", "usedKeys"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { configured: { type: "boolean" }, unused: { type: "boolean" } },
  required: ["configured", "unused"],
} as const;
/** Audit explicitly configured and observed research-response keys without collecting input. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { key, configuredKeys, usedKeys } = request;
  const compute = (): Output => {
    return {
      configured: configuredKeys.includes(key),
      unused: configuredKeys.includes(key) && !usedKeys.includes(key),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { key: "j", configuredKeys: ["f", "j"], usedKeys: ["f"] },
  output: { configured: true, unused: true },
} satisfies ToolExample<Input, Output>;
export const responseKeyUnusedChoiceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/response-key-unused-choice-flag",
    title: "Response Key Unused Choice Flag Tool",
    description:
      "Audit explicitly configured and observed research-response keys without collecting input.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "string", maxLength: 8192 },
        configuredKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        usedKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["key", "configuredKeys", "usedKeys"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        configured: { type: "boolean" },
        unused: { type: "boolean" },
      },
      required: ["configured", "unused"],
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
          id: "configuredKeys",
          label: "Configured Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "usedKeys",
          label: "Used Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "configured",
          label: "Configured",
          valueType: { type: "boolean" },
        },
        { id: "unused", label: "Unused", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = responseKeyUnusedChoiceFlagTool.execute;
export default responseKeyUnusedChoiceFlagTool;
