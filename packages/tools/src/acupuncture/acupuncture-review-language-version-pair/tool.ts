import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceLanguage: string;
  readonly reviewedLanguage: string;
  readonly sourceVersion: string;
  readonly reviewedVersion: string;
  readonly translated: boolean;
};
export type Output = {
  readonly languageMatch: boolean;
  readonly versionMatch: boolean;
  readonly translationDeclared: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceLanguage: { type: "string", maxLength: 8192 },
    reviewedLanguage: { type: "string", maxLength: 8192 },
    sourceVersion: { type: "string", maxLength: 8192 },
    reviewedVersion: { type: "string", maxLength: 8192 },
    translated: { type: "boolean" },
  },
  required: [
    "sourceLanguage",
    "reviewedLanguage",
    "sourceVersion",
    "reviewedVersion",
    "translated",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageMatch: { type: "boolean" },
    versionMatch: { type: "boolean" },
    translationDeclared: { type: "boolean" },
  },
  required: ["languageMatch", "versionMatch", "translationDeclared"],
} as const;
/** Compare supplied review language/version and translation metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceLanguage,
    reviewedLanguage,
    sourceVersion,
    reviewedVersion,
    translated,
  } = request;
  const compute = (): Output => {
    return {
      languageMatch: sourceLanguage === reviewedLanguage,
      versionMatch: sourceVersion === reviewedVersion,
      translationDeclared: translated,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceLanguage: "zh",
    reviewedLanguage: "en",
    sourceVersion: "v1",
    reviewedVersion: "v1",
    translated: true,
  },
  output: {
    languageMatch: false,
    versionMatch: true,
    translationDeclared: true,
  },
} satisfies ToolExample<Input, Output>;
export const acupunctureReviewLanguageVersionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "acupuncture/acupuncture-review-language-version-pair",
      title: "Acupuncture Review Language Version Pair Tool",
      description:
        "Compare supplied review language/version and translation metadata.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceLanguage: { type: "string", maxLength: 8192 },
          reviewedLanguage: { type: "string", maxLength: 8192 },
          sourceVersion: { type: "string", maxLength: 8192 },
          reviewedVersion: { type: "string", maxLength: 8192 },
          translated: { type: "boolean" },
        },
        required: [
          "sourceLanguage",
          "reviewedLanguage",
          "sourceVersion",
          "reviewedVersion",
          "translated",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          languageMatch: { type: "boolean" },
          versionMatch: { type: "boolean" },
          translationDeclared: { type: "boolean" },
        },
        required: ["languageMatch", "versionMatch", "translationDeclared"],
      },
      ports: {
        inputs: [
          {
            id: "sourceLanguage",
            label: "Source Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "reviewedLanguage",
            label: "Reviewed Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceVersion",
            label: "Source Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "reviewedVersion",
            label: "Reviewed Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "translated",
            label: "Translated",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "languageMatch",
            label: "Language Match",
            valueType: { type: "boolean" },
          },
          {
            id: "versionMatch",
            label: "Version Match",
            valueType: { type: "boolean" },
          },
          {
            id: "translationDeclared",
            label: "Translation Declared",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acupunctureReviewLanguageVersionPairTool.execute;
export default acupunctureReviewLanguageVersionPairTool;
