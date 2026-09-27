import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferredLanguage: string;
  readonly documentLanguage: string;
  readonly interpreterUsed: boolean;
  readonly interpreterLanguage: string;
  readonly translationVersion: string;
  readonly requiredVersion: string;
};
export type Output = {
  readonly languageDirect: boolean;
  readonly interpretationMatched: boolean;
  readonly versionMatched: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredLanguage: { type: "string", maxLength: 8192 },
    documentLanguage: { type: "string", maxLength: 8192 },
    interpreterUsed: { type: "boolean" },
    interpreterLanguage: { type: "string", maxLength: 8192 },
    translationVersion: { type: "string", maxLength: 8192 },
    requiredVersion: { type: "string", maxLength: 8192 },
  },
  required: [
    "preferredLanguage",
    "documentLanguage",
    "interpreterUsed",
    "interpreterLanguage",
    "translationVersion",
    "requiredVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageDirect: { type: "boolean" },
    interpretationMatched: { type: "boolean" },
    versionMatched: { type: "boolean" },
  },
  required: ["languageDirect", "interpretationMatched", "versionMatched"],
} as const;
/** Audit explicit consent document language/version and interpreter metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    preferredLanguage,
    documentLanguage,
    interpreterUsed,
    interpreterLanguage,
    translationVersion,
    requiredVersion,
  } = request;
  const compute = (): Output => {
    return {
      languageDirect: preferredLanguage === documentLanguage,
      interpretationMatched:
        interpreterUsed && interpreterLanguage === preferredLanguage,
      versionMatched: translationVersion === requiredVersion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preferredLanguage: "fr",
    documentLanguage: "en",
    interpreterUsed: true,
    interpreterLanguage: "fr",
    translationVersion: "v2",
    requiredVersion: "v2",
  },
  output: {
    languageDirect: false,
    interpretationMatched: true,
    versionMatched: true,
  },
} satisfies ToolExample<Input, Output>;
export const gcpConsentLanguageDocumentPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-consent-language-document-pair",
    title: "GCP Consent Language Document Pair Tool",
    description:
      "Audit explicit consent document language/version and interpreter metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredLanguage: { type: "string", maxLength: 8192 },
        documentLanguage: { type: "string", maxLength: 8192 },
        interpreterUsed: { type: "boolean" },
        interpreterLanguage: { type: "string", maxLength: 8192 },
        translationVersion: { type: "string", maxLength: 8192 },
        requiredVersion: { type: "string", maxLength: 8192 },
      },
      required: [
        "preferredLanguage",
        "documentLanguage",
        "interpreterUsed",
        "interpreterLanguage",
        "translationVersion",
        "requiredVersion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageDirect: { type: "boolean" },
        interpretationMatched: { type: "boolean" },
        versionMatched: { type: "boolean" },
      },
      required: ["languageDirect", "interpretationMatched", "versionMatched"],
    },
    ports: {
      inputs: [
        {
          id: "preferredLanguage",
          label: "Preferred Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "documentLanguage",
          label: "Document Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "interpreterUsed",
          label: "Interpreter Used",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "interpreterLanguage",
          label: "Interpreter Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "translationVersion",
          label: "Translation Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredVersion",
          label: "Required Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "languageDirect",
          label: "Language Direct",
          valueType: { type: "boolean" },
        },
        {
          id: "interpretationMatched",
          label: "Interpretation Matched",
          valueType: { type: "boolean" },
        },
        {
          id: "versionMatched",
          label: "Version Matched",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpConsentLanguageDocumentPairTool.execute;
export default gcpConsentLanguageDocumentPairTool;
