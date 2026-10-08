import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly originalKeyword: string;
  readonly suppliedTranslation: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    originalKeyword: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTranslation: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "originalKeyword", "suppliedTranslation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit original-script and translated keyword strings without generating a translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, originalKeyword, suppliedTranslation } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(originalKeyword.length > 0, "originalKeyword");
    H.domain(suppliedTranslation.length > 0, "suppliedTranslation");
    return {
      token: JSON.stringify([recordId, originalKeyword, suppliedTranslation]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    originalKeyword: "mot",
    suppliedTranslation: "word",
  },
  output: { token: '["R17","mot","word"]' },
} satisfies ToolExample<Input, Output>;
export const translatedKeywordOriginalScriptPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cultural-studies", "cultural studies", "humanities"],
        keywords: ["cultural studies", "humanities"],
      },
      id: "cultural-studies/translated-keyword-original-script-pair",
      title: "Translated Keyword Original Script Pair",
      description:
        "Pair explicit original-script and translated keyword strings without generating a translation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          originalKeyword: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTranslation: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["recordId", "originalKeyword", "suppliedTranslation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalKeyword",
            label: "Original Keyword",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTranslation",
            label: "Supplied Translation",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = translatedKeywordOriginalScriptPairTool.execute;
export default translatedKeywordOriginalScriptPairTool;
