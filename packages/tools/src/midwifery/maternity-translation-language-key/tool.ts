import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly languageCode: string;
  readonly translationVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
    translationVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["documentId", "languageCode", "translationVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly recorded maternity-document translation language and version without assessing translation quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, languageCode, translationVersion } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0, "documentId");
    H.domain(languageCode.length > 0, "languageCode");
    H.domain(translationVersion.length > 0, "translationVersion");
    return {
      token: JSON.stringify([documentId, languageCode, translationVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "DOC17", languageCode: "es", translationVersion: "v2" },
  output: { token: '["DOC17","es","v2"]' },
} satisfies ToolExample<Input, Output>;
export const maternityTranslationLanguageKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/maternity-translation-language-key",
    title: "Maternity Translation Language Key",
    description:
      "Qualify an explicitly recorded maternity-document translation language and version without assessing translation quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        languageCode: { type: "string", maxLength: 8192, minLength: 1 },
        translationVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["documentId", "languageCode", "translationVersion"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languageCode",
          label: "Language Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "translationVersion",
          label: "Translation Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = maternityTranslationLanguageKeyTool.execute;
export default maternityTranslationLanguageKeyTool;
