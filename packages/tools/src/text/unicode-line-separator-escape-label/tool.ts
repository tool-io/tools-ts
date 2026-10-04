import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string };
export type Output = {
  readonly escaped: string;
  readonly lineSeparators: number;
  readonly paragraphSeparators: number;
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
    escaped: { type: "string", maxLength: 8192 },
    lineSeparators: { type: "integer" },
    paragraphSeparators: { type: "integer" },
  },
  required: ["escaped", "lineSeparators", "paragraphSeparators"],
} as const;
/** Compute unicode line separator escape label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    return {
      escaped: text
        .replaceAll("\u2028", "\\u2028")
        .replaceAll("\u2029", "\\u2029"),
      lineSeparators: [...text].filter((x) => x === "\u2028").length,
      paragraphSeparators: [...text].filter((x) => x === "\u2029").length,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "a b c" },
  output: {
    escaped: "a\\u2028b\\u2029c",
    lineSeparators: 1,
    paragraphSeparators: 1,
  },
} satisfies ToolExample<Input, Output>;
export const unicodeLineSeparatorEscapeLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/unicode-line-separator-escape-label",
  title: "Unicode Line Separator Escape Label Tool",
  description:
    "Compute unicode line separator escape label from explicit bounded inputs.",
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
      { id: "escaped", label: "Escaped", valueType: { type: "string" } },
      {
        id: "lineSeparators",
        label: "Line Separators",
        valueType: { type: "integer" },
      },
      {
        id: "paragraphSeparators",
        label: "Paragraph Separators",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = unicodeLineSeparatorEscapeLabelTool.execute;
export default unicodeLineSeparatorEscapeLabelTool;
