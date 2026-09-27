import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly language: string;
  readonly source: string;
  readonly sourceToken: string;
  readonly sourceLanguage: string;
};
export type Output = {
  readonly tokenMatches: boolean;
  readonly languageMatches: boolean;
  readonly provenanceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    language: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    sourceToken: { type: "string", maxLength: 8192 },
    sourceLanguage: { type: "string", maxLength: 8192 },
  },
  required: ["token", "language", "source", "sourceToken", "sourceLanguage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenMatches: { type: "boolean" },
    languageMatches: { type: "boolean" },
    provenanceKey: { type: "string", maxLength: 8192 },
  },
  required: ["tokenMatches", "languageMatches", "provenanceKey"],
} as const;
/** Compare literal label tokens and retain their supplied language and source; no allergen inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, language, source, sourceToken, sourceLanguage } = request;
  const compute = (): Output => {
    return {
      tokenMatches: token === sourceToken,
      languageMatches: language === sourceLanguage,
      provenanceKey: JSON.stringify([source, sourceLanguage, sourceToken]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "milk",
    language: "en",
    source: "label-A",
    sourceToken: "milk",
    sourceLanguage: "en",
  },
  output: {
    tokenMatches: true,
    languageMatches: true,
    provenanceKey: '["label-A","en","milk"]',
  },
} satisfies ToolExample<Input, Output>;
export const foodAllergenLabelTokenSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-allergen-label-token-source-pair",
    title: "Food Allergen Label Token Source Pair Tool",
    description:
      "Compare literal label tokens and retain their supplied language and source; no allergen inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        language: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        sourceToken: { type: "string", maxLength: 8192 },
        sourceLanguage: { type: "string", maxLength: 8192 },
      },
      required: [
        "token",
        "language",
        "source",
        "sourceToken",
        "sourceLanguage",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenMatches: { type: "boolean" },
        languageMatches: { type: "boolean" },
        provenanceKey: { type: "string", maxLength: 8192 },
      },
      required: ["tokenMatches", "languageMatches", "provenanceKey"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
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
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceToken",
          label: "Source Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLanguage",
          label: "Source Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "tokenMatches",
          label: "Token Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "languageMatches",
          label: "Language Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "provenanceKey",
          label: "Provenance Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodAllergenLabelTokenSourcePairTool.execute;
export default foodAllergenLabelTokenSourcePairTool;
