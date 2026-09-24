import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalId: string;
  readonly translationParent: string;
  readonly originalVersion: string;
  readonly translationSourceVersion: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly versionMatches: boolean;
  readonly sameLanguage: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalId: { type: "string", maxLength: 8192 },
    translationParent: { type: "string", maxLength: 8192 },
    originalVersion: { type: "string", maxLength: 8192 },
    translationSourceVersion: { type: "string", maxLength: 8192 },
    sourceLanguage: { type: "string", maxLength: 8192 },
    targetLanguage: { type: "string", maxLength: 8192 },
  },
  required: [
    "originalId",
    "translationParent",
    "originalVersion",
    "translationSourceVersion",
    "sourceLanguage",
    "targetLanguage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    sameLanguage: { type: "boolean" },
  },
  required: ["parentMatches", "versionMatches", "sameLanguage"],
} as const;
/** Compare supplied translated-label attribution and version metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    originalId,
    translationParent,
    originalVersion,
    translationSourceVersion,
    sourceLanguage,
    targetLanguage,
  } = request;
  const compute = (): Output => {
    return {
      parentMatches: originalId === translationParent,
      versionMatches: originalVersion === translationSourceVersion,
      sameLanguage: sourceLanguage === targetLanguage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalId: "L1",
    translationParent: "L1",
    originalVersion: "v2",
    translationSourceVersion: "v1",
    sourceLanguage: "en",
    targetLanguage: "fr",
  },
  output: { parentMatches: true, versionMatches: false, sameLanguage: false },
} satisfies ToolExample<Input, Output>;
export const medicineLabelOriginalTranslatedPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "community-pharmacy/medicine-label-original-translated-pair",
      title: "Medicine Label Original Translated Pair Tool",
      description:
        "Compare supplied translated-label attribution and version metadata.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalId: { type: "string", maxLength: 8192 },
          translationParent: { type: "string", maxLength: 8192 },
          originalVersion: { type: "string", maxLength: 8192 },
          translationSourceVersion: { type: "string", maxLength: 8192 },
          sourceLanguage: { type: "string", maxLength: 8192 },
          targetLanguage: { type: "string", maxLength: 8192 },
        },
        required: [
          "originalId",
          "translationParent",
          "originalVersion",
          "translationSourceVersion",
          "sourceLanguage",
          "targetLanguage",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentMatches: { type: "boolean" },
          versionMatches: { type: "boolean" },
          sameLanguage: { type: "boolean" },
        },
        required: ["parentMatches", "versionMatches", "sameLanguage"],
      },
      ports: {
        inputs: [
          {
            id: "originalId",
            label: "Original Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "translationParent",
            label: "Translation Parent",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalVersion",
            label: "Original Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "translationSourceVersion",
            label: "Translation Source Version",
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
            id: "targetLanguage",
            label: "Target Language",
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
            id: "sameLanguage",
            label: "Same Language",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicineLabelOriginalTranslatedPairTool.execute;
export default medicineLabelOriginalTranslatedPairTool;
