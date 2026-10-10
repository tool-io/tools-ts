import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agreementId: string;
  readonly articleText: string;
  readonly paragraphText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreementId: { type: "string", maxLength: 8192, minLength: 1 },
    articleText: { type: "string", maxLength: 8192, minLength: 1 },
    paragraphText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["agreementId", "articleText", "paragraphText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an explicit agreement article-paragraph citation key without retrieving or interpreting treaty text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agreementId, articleText, paragraphText } = request;
  const compute = (): Output => {
    H.domain(agreementId.length > 0, "agreementId");
    H.domain(articleText.length > 0, "articleText");
    H.domain(paragraphText.length > 0, "paragraphText");
    return { token: JSON.stringify([agreementId, articleText, paragraphText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    agreementId: "AGR17",
    articleText: "Article 3",
    paragraphText: "2(b)",
  },
  output: { token: '["AGR17","Article 3","2(b)"]' },
} satisfies ToolExample<Input, Output>;
export const agreementArticleParagraphCitationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "international-relations",
        "international relations",
        "social sciences",
      ],
      keywords: ["international relations", "social sciences"],
    },
    id: "international-relations/agreement-article-paragraph-citation",
    title: "Agreement Article Paragraph Citation",
    description:
      "Build an explicit agreement article-paragraph citation key without retrieving or interpreting treaty text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agreementId: { type: "string", maxLength: 8192, minLength: 1 },
        articleText: { type: "string", maxLength: 8192, minLength: 1 },
        paragraphText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["agreementId", "articleText", "paragraphText"],
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
          id: "agreementId",
          label: "Agreement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "articleText",
          label: "Article Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "paragraphText",
          label: "Paragraph Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agreementArticleParagraphCitationTool.execute;
export default agreementArticleParagraphCitationTool;
