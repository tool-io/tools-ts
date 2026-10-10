import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digitText: string };
export type Output = {
  readonly leadingZeros: number;
  readonly significantDigits: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digitText: { type: "string", maxLength: 8192 } },
  required: ["digitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingZeros: { type: "integer" },
    significantDigits: { type: "string", maxLength: 8192 },
  },
  required: ["leadingZeros", "significantDigits"],
} as const;
/** Count leading zeros in explicit ASCII decimal digits while preserving the remaining digit text without numeric coercion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digitText } = request;
  const compute = (): Output => {
    H.domain(/^[0-9]+(?![\s\S])/.test(digitText), "digitText");
    return (() => {
      let leadingZeros = 0;
      while (leadingZeros < digitText.length && digitText[leadingZeros] === "0")
        leadingZeros++;
      return { leadingZeros, significantDigits: digitText.slice(leadingZeros) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digitText: "00042" },
  output: { leadingZeros: 3, significantDigits: "42" },
} satisfies ToolExample<Input, Output>;
export const positionalDigitLeadingZeroCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["number", "mathematics"],
      keywords: ["number", "mathematics"],
    },
    id: "number/positional-digit-leading-zero-count",
    title: "Positional Digit Leading Zero Count",
    description:
      "Count leading zeros in explicit ASCII decimal digits while preserving the remaining digit text without numeric coercion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digitText: { type: "string", maxLength: 8192 } },
      required: ["digitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingZeros: { type: "integer" },
        significantDigits: { type: "string", maxLength: 8192 },
      },
      required: ["leadingZeros", "significantDigits"],
    },
    ports: {
      inputs: [
        {
          id: "digitText",
          label: "Digit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "leadingZeros",
          label: "Leading Zeros",
          valueType: { type: "integer" },
        },
        {
          id: "significantDigits",
          label: "Significant Digits",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = positionalDigitLeadingZeroCountTool.execute;
export default positionalDigitLeadingZeroCountTool;
