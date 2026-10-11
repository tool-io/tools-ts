import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestId: string;
  readonly sourceLanguage: string;
  readonly requestedLanguage: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceLanguage: { type: "string", maxLength: 8192, minLength: 1 },
    requestedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["requestId", "sourceLanguage", "requestedLanguage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit interpreter request language labels without inferring language ability or arranging services. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestId, sourceLanguage, requestedLanguage } = request;
  const compute = (): Output => {
    H.domain(requestId.length > 0, "requestId");
    H.domain(sourceLanguage.length > 0, "sourceLanguage");
    H.domain(requestedLanguage.length > 0, "requestedLanguage");
    return {
      token: JSON.stringify([requestId, sourceLanguage, requestedLanguage]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestId: "REQ17", sourceLanguage: "en", requestedLanguage: "es" },
  output: { token: '["REQ17","en","es"]' },
} satisfies ToolExample<Input, Output>;
export const interpreterRequestLanguagePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["social-work", "social work", "social sciences"],
      keywords: ["social work", "social sciences"],
    },
    id: "social-work/interpreter-request-language-pair",
    title: "Interpreter Request Language Pair",
    description:
      "Pair explicit interpreter request language labels without inferring language ability or arranging services.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceLanguage: { type: "string", maxLength: 8192, minLength: 1 },
        requestedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["requestId", "sourceLanguage", "requestedLanguage"],
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
          id: "requestId",
          label: "Request Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLanguage",
          label: "Source Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requestedLanguage",
          label: "Requested Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = interpreterRequestLanguagePairTool.execute;
export default interpreterRequestLanguagePairTool;
