import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedName: string;
  readonly suppliedAuthor: string;
  readonly parenthesizeAuthor: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedName: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAuthor: { type: "string", maxLength: 8192, minLength: 1 },
    parenthesizeAuthor: { type: "boolean" },
  },
  required: ["suppliedName", "suppliedAuthor", "parenthesizeAuthor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicitly supplied name and author text with an explicit parenthesis policy without determining nomenclatural history. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedName, suppliedAuthor, parenthesizeAuthor } = request;
  const compute = (): Output => {
    H.domain(
      suppliedName.length > 0 && suppliedAuthor.length > 0,
      "suppliedName",
    );
    return {
      label:
        suppliedName +
        " " +
        (parenthesizeAuthor ? "(" + suppliedAuthor + ")" : suppliedAuthor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedName: "Genus species",
    suppliedAuthor: "Author A",
    parenthesizeAuthor: true,
  },
  output: { label: "Genus species (Author A)" },
} satisfies ToolExample<Input, Output>;
export const taxonomicAuthorParenthesisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/taxonomic-author-parenthesis-label",
    title: "Taxonomic Author Parenthesis Label",
    description:
      "Format explicitly supplied name and author text with an explicit parenthesis policy without determining nomenclatural history.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedName: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAuthor: { type: "string", maxLength: 8192, minLength: 1 },
        parenthesizeAuthor: { type: "boolean" },
      },
      required: ["suppliedName", "suppliedAuthor", "parenthesizeAuthor"],
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
          id: "suppliedName",
          label: "Supplied Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAuthor",
          label: "Supplied Author",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parenthesizeAuthor",
          label: "Parenthesize Author",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = taxonomicAuthorParenthesisLabelTool.execute;
export default taxonomicAuthorParenthesisLabelTool;
