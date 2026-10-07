import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceId: string;
  readonly articleNumber: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceId: { type: "string", maxLength: 8192, minLength: 1 },
    articleNumber: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["referenceId", "articleNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit bibliography article identifier as text, including prefixes and leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceId, articleNumber } = request;
  const compute = (): Output => {
    H.domain(referenceId.length > 0, "referenceId");
    H.domain(articleNumber.length > 0, "articleNumber");
    return { token: JSON.stringify([referenceId, articleNumber]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceId: "R17", articleNumber: "e1042" },
  output: { token: '["R17","e1042"]' },
} satisfies ToolExample<Input, Output>;
export const bibliographyArticleNumberTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/bibliography-article-number-token",
    title: "Bibliography Article Number Token",
    description:
      "Preserve an explicit bibliography article identifier as text, including prefixes and leading zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceId: { type: "string", maxLength: 8192, minLength: 1 },
        articleNumber: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["referenceId", "articleNumber"],
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
          id: "referenceId",
          label: "Reference Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "articleNumber",
          label: "Article Number",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bibliographyArticleNumberTokenTool.execute;
export default bibliographyArticleNumberTokenTool;
