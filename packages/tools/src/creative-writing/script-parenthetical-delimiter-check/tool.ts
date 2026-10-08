import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly wrapped: boolean;
  readonly nestedParentheses: boolean;
};
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
    wrapped: { type: "boolean" },
    nestedParentheses: { type: "boolean" },
  },
  required: ["wrapped", "nestedParentheses"],
} as const;
/** Check whether a script parenthetical has outer parentheses and contains additional parentheses; this is not a full screenplay grammar validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    const wrapped = text.startsWith("(") && text.endsWith(")"),
      inside = wrapped ? text.slice(1, -1) : text;
    return { wrapped, nestedParentheses: wrapped && /[()]/.test(inside) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "(quietly)" },
  output: { wrapped: true, nestedParentheses: false },
} satisfies ToolExample<Input, Output>;
export const scriptParentheticalDelimiterCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/script-parenthetical-delimiter-check",
    title: "Script Parenthetical Delimiter Check",
    description:
      "Check whether a script parenthetical has outer parentheses and contains additional parentheses; this is not a full screenplay grammar validator.",
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
        wrapped: { type: "boolean" },
        nestedParentheses: { type: "boolean" },
      },
      required: ["wrapped", "nestedParentheses"],
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
        { id: "wrapped", label: "Wrapped", valueType: { type: "boolean" } },
        {
          id: "nestedParentheses",
          label: "Nested Parentheses",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = scriptParentheticalDelimiterCheckTool.execute;
export default scriptParentheticalDelimiterCheckTool;
