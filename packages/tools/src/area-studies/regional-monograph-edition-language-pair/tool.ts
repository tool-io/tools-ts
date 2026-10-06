import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly monographId: string;
  readonly editionText: string;
  readonly languageTag: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monographId: { type: "string", maxLength: 8192, minLength: 1 },
    editionText: { type: "string", maxLength: 8192, minLength: 1 },
    languageTag: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["monographId", "editionText", "languageTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit regional monograph edition and supplied language tag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { monographId, editionText, languageTag } = request;
  const compute = (): Output => {
    H.domain(monographId.length > 0, "monographId");
    H.domain(editionText.length > 0, "editionText");
    H.domain(languageTag.length > 0, "languageTag");
    return { token: JSON.stringify([monographId, editionText, languageTag]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { monographId: "M17", editionText: "2nd edition", languageTag: "es" },
  output: { token: '["M17","2nd edition","es"]' },
} satisfies ToolExample<Input, Output>;
export const regionalMonographEditionLanguagePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["area-studies", "area studies", "humanities"],
        keywords: ["area studies", "humanities"],
      },
      id: "area-studies/regional-monograph-edition-language-pair",
      title: "Regional Monograph Edition Language Pair",
      description:
        "Record an explicit regional monograph edition and supplied language tag.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          monographId: { type: "string", maxLength: 8192, minLength: 1 },
          editionText: { type: "string", maxLength: 8192, minLength: 1 },
          languageTag: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["monographId", "editionText", "languageTag"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "monographId",
            label: "Monograph Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "editionText",
            label: "Edition Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "languageTag",
            label: "Language Tag",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = regionalMonographEditionLanguagePairTool.execute;
export default regionalMonographEditionLanguagePairTool;
