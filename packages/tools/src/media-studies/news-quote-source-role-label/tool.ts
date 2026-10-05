import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sourceCode: string; readonly role: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceCode: { type: "string", maxLength: 8192 },
    role: { type: "string", maxLength: 8192 },
  },
  required: ["sourceCode", "role"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded news-quotation source role without inferring expertise or credibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceCode, role } = request;
  const compute = (): Output => {
    H.domain(sourceCode.length > 0 && role.trim().length > 0, "sourceCode");
    return { label: sourceCode + " [quoted as " + role + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceCode: "S7", role: "witness" },
  output: { label: "S7 [quoted as witness]" },
} satisfies ToolExample<Input, Output>;
export const newsQuoteSourceRoleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/news-quote-source-role-label",
    title: "News Quote Source Role Label Tool",
    description:
      "Label an explicitly recorded news-quotation source role without inferring expertise or credibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceCode: { type: "string", maxLength: 8192 },
        role: { type: "string", maxLength: 8192 },
      },
      required: ["sourceCode", "role"],
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
          id: "sourceCode",
          label: "Source Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = newsQuoteSourceRoleLabelTool.execute;
export default newsQuoteSourceRoleLabelTool;
