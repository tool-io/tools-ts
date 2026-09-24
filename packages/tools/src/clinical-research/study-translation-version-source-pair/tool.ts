import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly formId: string;
  readonly translatedParent: string;
  readonly sourceVersion: string;
  readonly translatedSourceVersion: string;
  readonly language: string;
  readonly requiredLanguage: string;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly versionMatches: boolean;
  readonly languageMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    formId: { type: "string", maxLength: 8192 },
    translatedParent: { type: "string", maxLength: 8192 },
    sourceVersion: { type: "string", maxLength: 8192 },
    translatedSourceVersion: { type: "string", maxLength: 8192 },
    language: { type: "string", maxLength: 8192 },
    requiredLanguage: { type: "string", maxLength: 8192 },
  },
  required: [
    "formId",
    "translatedParent",
    "sourceVersion",
    "translatedSourceVersion",
    "language",
    "requiredLanguage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    languageMatches: { type: "boolean" },
  },
  required: ["parentMatches", "versionMatches", "languageMatches"],
} as const;
/** Compare explicit translated research-form provenance fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    formId,
    translatedParent,
    sourceVersion,
    translatedSourceVersion,
    language,
    requiredLanguage,
  } = request;
  const compute = (): Output => {
    return {
      parentMatches: formId === translatedParent,
      versionMatches: sourceVersion === translatedSourceVersion,
      languageMatches: language === requiredLanguage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    formId: "F1",
    translatedParent: "F1",
    sourceVersion: "v2",
    translatedSourceVersion: "v2",
    language: "fr",
    requiredLanguage: "fr",
  },
  output: { parentMatches: true, versionMatches: true, languageMatches: true },
} satisfies ToolExample<Input, Output>;
export const studyTranslationVersionSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/study-translation-version-source-pair",
    title: "Study Translation Version Source Pair Tool",
    description: "Compare explicit translated research-form provenance fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        formId: { type: "string", maxLength: 8192 },
        translatedParent: { type: "string", maxLength: 8192 },
        sourceVersion: { type: "string", maxLength: 8192 },
        translatedSourceVersion: { type: "string", maxLength: 8192 },
        language: { type: "string", maxLength: 8192 },
        requiredLanguage: { type: "string", maxLength: 8192 },
      },
      required: [
        "formId",
        "translatedParent",
        "sourceVersion",
        "translatedSourceVersion",
        "language",
        "requiredLanguage",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentMatches: { type: "boolean" },
        versionMatches: { type: "boolean" },
        languageMatches: { type: "boolean" },
      },
      required: ["parentMatches", "versionMatches", "languageMatches"],
    },
    ports: {
      inputs: [
        {
          id: "formId",
          label: "Form Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "translatedParent",
          label: "Translated Parent",
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
          id: "translatedSourceVersion",
          label: "Translated Source Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "language",
          label: "Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredLanguage",
          label: "Required Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "parentMatches",
          label: "Parent Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "languageMatches",
          label: "Language Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = studyTranslationVersionSourcePairTool.execute;
export default studyTranslationVersionSourcePairTool;
