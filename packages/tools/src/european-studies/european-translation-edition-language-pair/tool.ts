import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalLanguage: string;
  readonly translatedLanguage: string;
  readonly edition: string;
};
export type Output = { readonly label: string; readonly sameLanguage: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalLanguage: { type: "string", maxLength: 8192 },
    translatedLanguage: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["originalLanguage", "translatedLanguage", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    sameLanguage: { type: "boolean" },
  },
  required: ["label", "sameLanguage"],
} as const;
/** Label supplied translation-edition language fields and compare the language strings case-insensitively; no translation or registry lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalLanguage, translatedLanguage, edition } = request;
  const compute = (): Output => {
    H.domain(
      originalLanguage.length > 0 &&
        translatedLanguage.length > 0 &&
        edition.length > 0,
      "originalLanguage",
    );
    return {
      label:
        edition + " [" + originalLanguage + " → " + translatedLanguage + "]",
      sameLanguage:
        originalLanguage.toLowerCase() === translatedLanguage.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalLanguage: "de",
    translatedLanguage: "fr",
    edition: "Edition 2",
  },
  output: { label: "Edition 2 [de → fr]", sameLanguage: false },
} satisfies ToolExample<Input, Output>;
export const europeanTranslationEditionLanguagePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "european-studies/european-translation-edition-language-pair",
      title: "European Translation Edition Language Pair Tool",
      description:
        "Label supplied translation-edition language fields and compare the language strings case-insensitively; no translation or registry lookup.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalLanguage: { type: "string", maxLength: 8192 },
          translatedLanguage: { type: "string", maxLength: 8192 },
          edition: { type: "string", maxLength: 8192 },
        },
        required: ["originalLanguage", "translatedLanguage", "edition"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string", maxLength: 8192 },
          sameLanguage: { type: "boolean" },
        },
        required: ["label", "sameLanguage"],
      },
      ports: {
        inputs: [
          {
            id: "originalLanguage",
            label: "Original Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "translatedLanguage",
            label: "Translated Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "edition",
            label: "Edition",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
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
export const run = europeanTranslationEditionLanguagePairTool.execute;
export default europeanTranslationEditionLanguagePairTool;
