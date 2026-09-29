import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lexical: string; readonly language: string };
export type Output = {
  readonly normalizedLanguage: string;
  readonly identityKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lexical: { type: "string", maxLength: 8192 },
    language: { type: "string", maxLength: 8192 },
  },
  required: ["lexical", "language"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedLanguage: { type: "string", maxLength: 8192 },
    identityKey: { type: "string", maxLength: 8192 },
  },
  required: ["normalizedLanguage", "identityKey"],
} as const;
/** Language-tagged RDF literal identity preserves lexical text and ASCII-case-normalizes a syntactically shaped language tag; no IANA registry validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lexical, language } = request;
  const compute = (): Output => {
    H.domain(/^[A-Za-z]+(?:-[A-Za-z0-9]+)*(?![\s\S])/.test(language));
    const normalizedLanguage = language.toLowerCase();
    return {
      normalizedLanguage,
      identityKey: JSON.stringify([lexical, normalizedLanguage]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lexical: "colour", language: "EN-gb" },
  output: { normalizedLanguage: "en-gb", identityKey: '["colour","en-gb"]' },
} satisfies ToolExample<Input, Output>;
export const rdfLanguageTagLiteralPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/rdf-language-tag-literal-pair",
    title: "RDF Language Tag Literal Pair Tool",
    description:
      "Language-tagged RDF literal identity preserves lexical text and ASCII-case-normalizes a syntactically shaped language tag; no IANA registry validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lexical: { type: "string", maxLength: 8192 },
        language: { type: "string", maxLength: 8192 },
      },
      required: ["lexical", "language"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedLanguage: { type: "string", maxLength: 8192 },
        identityKey: { type: "string", maxLength: 8192 },
      },
      required: ["normalizedLanguage", "identityKey"],
    },
    ports: {
      inputs: [
        {
          id: "lexical",
          label: "Lexical",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "language",
          label: "Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalizedLanguage",
          label: "Normalized Language",
          valueType: { type: "string" },
        },
        {
          id: "identityKey",
          label: "Identity Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = rdfLanguageTagLiteralPairTool.execute;
export default rdfLanguageTagLiteralPairTool;
