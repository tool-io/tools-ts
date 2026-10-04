import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly content: string };
export type Output = { readonly content: string; readonly trimmed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { content: { type: "string", maxLength: 8192 } },
  required: ["content"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    content: { type: "string", maxLength: 8192 },
    trimmed: { type: "boolean" },
  },
  required: ["content", "trimmed"],
} as const;
/** Calculate markdown code span edge space rule from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { content } = request;
  const compute = (): Output => {
    const normalized = content.replace(/\r\n|\r|\n/g, " "),
      trimmed =
        normalized.startsWith(" ") &&
        normalized.endsWith(" ") &&
        /[^ ]/.test(normalized);
    return { content: trimmed ? normalized.slice(1, -1) : normalized, trimmed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { content: " code " },
  output: { content: "code", trimmed: true },
} satisfies ToolExample<Input, Output>;
export const markdownCodeSpanEdgeSpaceRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/markdown-code-span-edge-space-rule",
    title: "Markdown Code Span Edge Space Rule Tool",
    description:
      "Calculate markdown code span edge space rule from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { content: { type: "string", maxLength: 8192 } },
      required: ["content"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        content: { type: "string", maxLength: 8192 },
        trimmed: { type: "boolean" },
      },
      required: ["content", "trimmed"],
    },
    ports: {
      inputs: [
        {
          id: "content",
          label: "Content",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "content", label: "Content", valueType: { type: "string" } },
        { id: "trimmed", label: "Trimmed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = markdownCodeSpanEdgeSpaceRuleTool.execute;
export default markdownCodeSpanEdgeSpaceRuleTool;
