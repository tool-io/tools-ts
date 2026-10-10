import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly enclosed: boolean; readonly innerText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enclosed: { type: "boolean" },
    innerText: { type: "string", maxLength: 8192 },
  },
  required: ["enclosed", "innerText"],
} as const;
/** Inspect explicit outer angle delimiters without asserting CommonMark URL or email autolink validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    return {
      enclosed: text.startsWith("<") && text.endsWith(">") && text.length >= 2,
      innerText:
        text.startsWith("<") && text.endsWith(">") && text.length >= 2
          ? text.slice(1, -1)
          : text,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "<https://example.test/>" },
  output: { enclosed: true, innerText: "https://example.test/" },
} satisfies ToolExample<Input, Output>;
export const markdownAutolinkDelimiterTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["parse", "data parsing", "computer science"],
      keywords: ["data parsing", "computer science"],
    },
    id: "parse/markdown-autolink-delimiter-token",
    title: "Markdown Autolink Delimiter Token",
    description:
      "Inspect explicit outer angle delimiters without asserting CommonMark URL or email autolink validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enclosed: { type: "boolean" },
        innerText: { type: "string", maxLength: 8192 },
      },
      required: ["enclosed", "innerText"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "enclosed", label: "Enclosed", valueType: { type: "boolean" } },
        { id: "innerText", label: "Inner Text", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = markdownAutolinkDelimiterTokenTool.execute;
export default markdownAutolinkDelimiterTokenTool;
