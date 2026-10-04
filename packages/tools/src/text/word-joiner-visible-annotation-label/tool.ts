import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string };
export type Output = { readonly annotated: string; readonly count: number };
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
    annotated: { type: "string", maxLength: 8192 },
    count: { type: "integer" },
  },
  required: ["annotated", "count"],
} as const;
/** Compute word joiner visible annotation label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    const count = [...text].filter((x) => x === "\u2060").length;
    return { annotated: text.replaceAll("\u2060", "[WORD JOINER]"), count };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "a⁠b" },
  output: { annotated: "a[WORD JOINER]b", count: 1 },
} satisfies ToolExample<Input, Output>;
export const wordJoinerVisibleAnnotationLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/word-joiner-visible-annotation-label",
  title: "Word Joiner Visible Annotation Label Tool",
  description:
    "Compute word joiner visible annotation label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "annotated", label: "Annotated", valueType: { type: "string" } },
      { id: "count", label: "Count", valueType: { type: "integer" } },
    ],
  },
});
export const run = wordJoinerVisibleAnnotationLabelTool.execute;
export default wordJoinerVisibleAnnotationLabelTool;
