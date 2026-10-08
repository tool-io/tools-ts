import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceWording: string;
  readonly translatedWording: string;
  readonly translatorCredit: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceWording: { type: "string", maxLength: 8192, minLength: 1 },
    translatedWording: { type: "string", maxLength: 8192, minLength: 1 },
    translatorCredit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceWording", "translatedWording", "translatorCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label literal source/translation wording and an explicit translator credit without generating or validating a translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceWording, translatedWording, translatorCredit } = request;
  const compute = (): Output => {
    H.domain(
      sourceWording.length > 0 &&
        translatedWording.length > 0 &&
        translatorCredit.length > 0,
      "sourceWording",
    );
    return {
      label:
        JSON.stringify(sourceWording) +
        " → " +
        JSON.stringify(translatedWording) +
        " [translator: " +
        translatorCredit +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceWording: "source phrase",
    translatedWording: "translated phrase",
    translatorCredit: "Translator A",
  },
  output: {
    label: '"source phrase" → "translated phrase" [translator: Translator A]',
  },
} satisfies ToolExample<Input, Output>;
export const ethnographicTranslationVariantLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "cultural-anthropology",
          "cultural anthropology",
          "social sciences",
        ],
        keywords: ["cultural anthropology", "social sciences"],
      },
      id: "cultural-anthropology/ethnographic-translation-variant-label",
      title: "Ethnographic Translation Variant Label",
      description:
        "Label literal source/translation wording and an explicit translator credit without generating or validating a translation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceWording: { type: "string", maxLength: 8192, minLength: 1 },
          translatedWording: { type: "string", maxLength: 8192, minLength: 1 },
          translatorCredit: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sourceWording", "translatedWording", "translatorCredit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "sourceWording",
            label: "Source Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "translatedWording",
            label: "Translated Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "translatorCredit",
            label: "Translator Credit",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = ethnographicTranslationVariantLabelTool.execute;
export default ethnographicTranslationVariantLabelTool;
