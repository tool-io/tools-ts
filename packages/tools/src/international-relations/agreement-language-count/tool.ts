import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly languageTokens: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["languageTokens", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Count supplied language labels under an explicit case policy, without language-tag canonicalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { languageTokens, caseSensitive } = request;
  const compute = (): Output => {
    return {
      count: new Set(
        languageTokens.map((x) => (caseSensitive ? x : x.toLowerCase())),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { languageTokens: ["en", "EN", "fr"], caseSensitive: false },
  output: { count: 2 },
} satisfies ToolExample<Input, Output>;
export const agreementLanguageCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/agreement-language-count",
    title: "Agreement Language Count Tool",
    description:
      "Count supplied language labels under an explicit case policy, without language-tag canonicalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        caseSensitive: { type: "boolean" },
      },
      required: ["languageTokens", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
    },
    ports: {
      inputs: [
        {
          id: "languageTokens",
          label: "Language Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = agreementLanguageCountTool.execute;
export default agreementLanguageCountTool;
