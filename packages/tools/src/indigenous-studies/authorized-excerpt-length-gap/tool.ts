import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly excerpt: string;
  readonly authorizedCodePointLimit: number;
};
export type Output = { readonly used: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excerpt: { type: "string", maxLength: 8192 },
    authorizedCodePointLimit: { type: "integer", minimum: 0 },
  },
  required: ["excerpt", "authorizedCodePointLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { used: { type: "integer" }, gap: { type: "integer" } },
  required: ["used", "gap"],
} as const;
/** Compare an explicitly authorized excerpt against a supplied code-point limit without determining permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { excerpt, authorizedCodePointLimit } = request;
  const compute = (): Output => {
    H.integer(authorizedCodePointLimit, 0);
    return {
      used: [...excerpt].length,
      gap: authorizedCodePointLimit - [...excerpt].length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { excerpt: "A🚀", authorizedCodePointLimit: 5 },
  output: { used: 2, gap: 3 },
} satisfies ToolExample<Input, Output>;
export const authorizedExcerptLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/authorized-excerpt-length-gap",
    title: "Authorized Excerpt Length Gap Tool",
    description:
      "Compare an explicitly authorized excerpt against a supplied code-point limit without determining permission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excerpt: { type: "string", maxLength: 8192 },
        authorizedCodePointLimit: { type: "integer", minimum: 0 },
      },
      required: ["excerpt", "authorizedCodePointLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { used: { type: "integer" }, gap: { type: "integer" } },
      required: ["used", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "excerpt",
          label: "Excerpt",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorizedCodePointLimit",
          label: "Authorized Code Point Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "used", label: "Used", valueType: { type: "integer" } },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = authorizedExcerptLengthGapTool.execute;
export default authorizedExcerptLengthGapTool;
