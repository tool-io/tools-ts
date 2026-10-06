import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly literalText: string };
export type Output = { readonly escapedText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { literalText: { type: "string", maxLength: 8192 } },
  required: ["literalText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { escapedText: { type: "string", maxLength: 8192 } },
  required: ["escapedText"],
} as const;
/** Escape literal braces for a Python-style brace-format template by doubling both brace characters; no prompt is sent or evaluated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { literalText } = request;
  const compute = (): Output => {
    return { escapedText: literalText.replace(/{/g, "{{").replace(/}/g, "}}") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { literalText: "Use {name} literally" },
  output: { escapedText: "Use {{name}} literally" },
} satisfies ToolExample<Input, Output>;
export const promptPlaceholderEscapeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/prompt-placeholder-escape",
    title: "Prompt Placeholder Escape",
    description:
      "Escape literal braces for a Python-style brace-format template by doubling both brace characters; no prompt is sent or evaluated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { literalText: { type: "string", maxLength: 8192 } },
      required: ["literalText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { escapedText: { type: "string", maxLength: 8192 } },
      required: ["escapedText"],
    },
    ports: {
      inputs: [
        {
          id: "literalText",
          label: "Literal Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "escapedText",
          label: "Escaped Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = promptPlaceholderEscapeTool.execute;
export default promptPlaceholderEscapeTool;
