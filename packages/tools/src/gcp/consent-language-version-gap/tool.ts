import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly language: string;
  readonly acknowledgedVersion: string;
  readonly requiredVersions: readonly string[];
  readonly languages: readonly string[];
};
export type Output = {
  readonly languageKnown: boolean;
  readonly versionMatches: boolean;
  readonly expectedVersion: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    language: { type: "string", maxLength: 8192 },
    acknowledgedVersion: { type: "string", maxLength: 8192 },
    requiredVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    languages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "language",
    "acknowledgedVersion",
    "requiredVersions",
    "languages",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageKnown: { type: "boolean" },
    versionMatches: { type: "boolean" },
    expectedVersion: { type: "string", maxLength: 8192 },
  },
  required: ["languageKnown", "versionMatches", "expectedVersion"],
} as const;
/** Compare explicit language/version document metadata without determining legal consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { language, acknowledgedVersion, requiredVersions, languages } =
    request;
  const compute = (): Output => {
    H.sameLength(requiredVersions, languages);
    H.domain(new Set(languages).size === languages.length);
    return (() => {
      const i = languages.indexOf(language);
      return {
        languageKnown: i >= 0,
        versionMatches: i >= 0 && acknowledgedVersion === requiredVersions[i],
        expectedVersion: i >= 0 ? requiredVersions[i] : "",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    language: "en",
    acknowledgedVersion: "v1",
    requiredVersions: ["v2", "v1"],
    languages: ["en", "fr"],
  },
  output: { languageKnown: true, versionMatches: false, expectedVersion: "v2" },
} satisfies ToolExample<Input, Output>;
export const consentLanguageVersionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/consent-language-version-gap",
    title: "Consent Language Version Gap Tool",
    description:
      "Compare explicit language/version document metadata without determining legal consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        language: { type: "string", maxLength: 8192 },
        acknowledgedVersion: { type: "string", maxLength: 8192 },
        requiredVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        languages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "language",
        "acknowledgedVersion",
        "requiredVersions",
        "languages",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageKnown: { type: "boolean" },
        versionMatches: { type: "boolean" },
        expectedVersion: { type: "string", maxLength: 8192 },
      },
      required: ["languageKnown", "versionMatches", "expectedVersion"],
    },
    ports: {
      inputs: [
        {
          id: "language",
          label: "Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "acknowledgedVersion",
          label: "Acknowledged Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredVersions",
          label: "Required Versions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "languages",
          label: "Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "languageKnown",
          label: "Language Known",
          valueType: { type: "boolean" },
        },
        {
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "expectedVersion",
          label: "Expected Version",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentLanguageVersionGapTool.execute;
export default consentLanguageVersionGapTool;
