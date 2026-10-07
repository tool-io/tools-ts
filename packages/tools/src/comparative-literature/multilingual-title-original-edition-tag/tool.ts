import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly editionId: string;
  readonly titleText: string;
  readonly languageTag: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    titleText: { type: "string", maxLength: 8192, minLength: 1 },
    languageTag: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["editionId", "titleText", "languageTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate a supplied edition title with its explicit language tag without translating or detecting language. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { editionId, titleText, languageTag } = request;
  const compute = (): Output => {
    H.domain(editionId.length > 0, "editionId");
    H.domain(titleText.length > 0, "titleText");
    H.domain(languageTag.length > 0, "languageTag");
    return { token: JSON.stringify([editionId, titleText, languageTag]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { editionId: "E17", titleText: "La rivière", languageTag: "fr" },
  output: { token: '["E17","La rivière","fr"]' },
} satisfies ToolExample<Input, Output>;
export const multilingualTitleOriginalEditionTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "comparative-literature",
          "comparative literature",
          "humanities",
        ],
        keywords: ["comparative literature", "humanities"],
      },
      id: "comparative-literature/multilingual-title-original-edition-tag",
      title: "Multilingual Title Original Edition Tag",
      description:
        "Associate a supplied edition title with its explicit language tag without translating or detecting language.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          editionId: { type: "string", maxLength: 8192, minLength: 1 },
          titleText: { type: "string", maxLength: 8192, minLength: 1 },
          languageTag: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["editionId", "titleText", "languageTag"],
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
            id: "editionId",
            label: "Edition Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "titleText",
            label: "Title Text",
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
export const run = multilingualTitleOriginalEditionTagTool.execute;
export default multilingualTitleOriginalEditionTagTool;
