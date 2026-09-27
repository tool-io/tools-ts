import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
  readonly unicodeSlash: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "integer" },
    denominator: { type: "integer" },
    unicodeSlash: { type: "boolean" },
  },
  required: ["numerator", "denominator", "unicodeSlash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Render integer fraction components with a fraction slash or an ASCII solidus, without reducing. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { numerator, denominator, unicodeSlash } = input;
  const compute = (): Output => {
    H.domain(denominator !== 0);
    return { text: numerator + (unicodeSlash ? "⁄" : "/") + denominator };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numerator: 3, denominator: 4, unicodeSlash: true },
  output: { text: "3⁄4" },
} satisfies ToolExample<Input, Output>;
export const fractionVulgarSlashDisplayChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/fraction-vulgar-slash-display-choice",
    title: "Fraction Vulgar Slash Display Choice Tool",
    description:
      "Render integer fraction components with a fraction slash or an ASCII solidus, without reducing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "integer" },
        denominator: { type: "integer" },
        unicodeSlash: { type: "boolean" },
      },
      required: ["numerator", "denominator", "unicodeSlash"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unicodeSlash",
          label: "Unicode Slash",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fractionVulgarSlashDisplayChoiceTool.execute;
export default fractionVulgarSlashDisplayChoiceTool;
