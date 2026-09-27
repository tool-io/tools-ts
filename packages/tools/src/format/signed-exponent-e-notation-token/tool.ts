import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mantissa: string;
  readonly exponent: number;
  readonly uppercase: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mantissa: { type: "string", maxLength: 8192 },
    exponent: { type: "integer" },
    uppercase: { type: "boolean" },
  },
  required: ["mantissa", "exponent", "uppercase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Format a validated decimal mantissa and signed integer exponent without evaluating or rounding them. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mantissa, exponent, uppercase } = input;
  const compute = (): Output => {
    H.domain(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?![\s\S])/.test(mantissa));
    return {
      text:
        mantissa +
        (uppercase ? "E" : "e") +
        (exponent >= 0 ? "+" : "") +
        exponent,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mantissa: "1.25", exponent: 3, uppercase: false },
  output: { text: "1.25e+3" },
} satisfies ToolExample<Input, Output>;
export const signedExponentENotationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/signed-exponent-e-notation-token",
    title: "Signed Exponent E Notation Token Tool",
    description:
      "Format a validated decimal mantissa and signed integer exponent without evaluating or rounding them.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mantissa: { type: "string", maxLength: 8192 },
        exponent: { type: "integer" },
        uppercase: { type: "boolean" },
      },
      required: ["mantissa", "exponent", "uppercase"],
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
          id: "mantissa",
          label: "Mantissa",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uppercase",
          label: "Uppercase",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = signedExponentENotationTokenTool.execute;
export default signedExponentENotationTokenTool;
