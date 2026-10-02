import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly handle: string; readonly suffix: string };
export type Output = {
  readonly validHandle: boolean;
  readonly emptySuffix: boolean;
  readonly formsNonSpecificTag: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    handle: { type: "string", maxLength: 8192 },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["handle", "suffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validHandle: { type: "boolean" },
    emptySuffix: { type: "boolean" },
    formsNonSpecificTag: { type: "boolean" },
  },
  required: ["validHandle", "emptySuffix", "formsNonSpecificTag"],
} as const;
/** Inspect a supplied YAML tag handle and suffix without resolving tag directives. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { handle, suffix } = request;
  const compute = (): Output => {
    const validHandle = /^(?:!|!!|![0-9A-Za-z-]+!)(?![\s\S])/.test(handle);
    return {
      validHandle,
      emptySuffix: suffix.length === 0,
      formsNonSpecificTag: handle === "!" && suffix === "",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { handle: "!", suffix: "" },
  output: { validHandle: true, emptySuffix: true, formsNonSpecificTag: true },
} satisfies ToolExample<Input, Output>;
export const yamlTagHandleEmptySuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/yaml-tag-handle-empty-suffix",
    title: "Yaml Tag Handle Empty Suffix Tool",
    description:
      "Inspect a supplied YAML tag handle and suffix without resolving tag directives.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        handle: { type: "string", maxLength: 8192 },
        suffix: { type: "string", maxLength: 8192 },
      },
      required: ["handle", "suffix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validHandle: { type: "boolean" },
        emptySuffix: { type: "boolean" },
        formsNonSpecificTag: { type: "boolean" },
      },
      required: ["validHandle", "emptySuffix", "formsNonSpecificTag"],
    },
    ports: {
      inputs: [
        {
          id: "handle",
          label: "Handle",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "validHandle",
          label: "Valid Handle",
          valueType: { type: "boolean" },
        },
        {
          id: "emptySuffix",
          label: "Empty Suffix",
          valueType: { type: "boolean" },
        },
        {
          id: "formsNonSpecificTag",
          label: "Forms Non Specific Tag",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = yamlTagHandleEmptySuffixTool.execute;
export default yamlTagHandleEmptySuffixTool;
