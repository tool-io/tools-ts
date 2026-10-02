import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly articleReference: string;
  readonly separator: string;
  readonly rootToken: string;
};
export type Output = { readonly depth: number; readonly underRoot: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    articleReference: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
    rootToken: { type: "string", maxLength: 8192 },
  },
  required: ["articleReference", "separator", "rootToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "integer" }, underRoot: { type: "boolean" } },
  required: ["depth", "underRoot"],
} as const;
/** Inspect an explicit public agreement reference hierarchy without interpreting obligations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { articleReference, separator, rootToken } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0 && rootToken.length > 0);
    return {
      depth:
        articleReference === "" ? 0 : articleReference.split(separator).length,
      underRoot:
        articleReference === rootToken ||
        articleReference.startsWith(rootToken + separator),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { articleReference: "A.2.3", separator: ".", rootToken: "A" },
  output: { depth: 3, underRoot: true },
} satisfies ToolExample<Input, Output>;
export const publicAgreementArticleDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/public-agreement-article-depth",
    title: "Public Agreement Article Depth Tool",
    description:
      "Inspect an explicit public agreement reference hierarchy without interpreting obligations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        articleReference: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
        rootToken: { type: "string", maxLength: 8192 },
      },
      required: ["articleReference", "separator", "rootToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer" },
        underRoot: { type: "boolean" },
      },
      required: ["depth", "underRoot"],
    },
    ports: {
      inputs: [
        {
          id: "articleReference",
          label: "Article Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rootToken",
          label: "Root Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
        {
          id: "underRoot",
          label: "Under Root",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicAgreementArticleDepthTool.execute;
export default publicAgreementArticleDepthTool;
