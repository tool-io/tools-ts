import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTerm: string;
  readonly translatedTerm: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTerm: { type: "string", maxLength: 8192 },
    translatedTerm: { type: "string", maxLength: 8192 },
    sourceLanguage: { type: "string", maxLength: 8192 },
    targetLanguage: { type: "string", maxLength: 8192 },
  },
  required: [
    "sourceTerm",
    "translatedTerm",
    "sourceLanguage",
    "targetLanguage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Pair supplied source and translated terms with explicit language labels, without generating a translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTerm, translatedTerm, sourceLanguage, targetLanguage } =
    request;
  const compute = (): Output => {
    H.domain(
      sourceTerm.length > 0 &&
        translatedTerm.length > 0 &&
        sourceLanguage.length > 0 &&
        targetLanguage.length > 0,
      "sourceTerm",
    );
    return {
      label:
        sourceTerm +
        " [" +
        sourceLanguage +
        "] → " +
        translatedTerm +
        " [" +
        targetLanguage +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceTerm: "maison",
    translatedTerm: "house",
    sourceLanguage: "fr",
    targetLanguage: "en",
  },
  output: { label: "maison [fr] → house [en]" },
} satisfies ToolExample<Input, Output>;
export const translatedTermSourceVariantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/translated-term-source-variant",
    title: "Translated Term Source Variant Tool",
    description:
      "Pair supplied source and translated terms with explicit language labels, without generating a translation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTerm: { type: "string", maxLength: 8192 },
        translatedTerm: { type: "string", maxLength: 8192 },
        sourceLanguage: { type: "string", maxLength: 8192 },
        targetLanguage: { type: "string", maxLength: 8192 },
      },
      required: [
        "sourceTerm",
        "translatedTerm",
        "sourceLanguage",
        "targetLanguage",
      ],
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
          id: "sourceTerm",
          label: "Source Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "translatedTerm",
          label: "Translated Term",
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
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = translatedTermSourceVariantTool.execute;
export default translatedTermSourceVariantTool;
