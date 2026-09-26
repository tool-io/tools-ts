import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digit: number };
export type Output = { readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digit: { type: "integer", minimum: 0, maximum: 35 } },
  required: ["digit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
/** Calculate punycode digit to generalized integer from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { digit } = input;
  const compute = (): Output => {
    H.integer(digit, 0, 35);
    return {
      symbol: String.fromCharCode(digit < 26 ? 97 + digit : 48 + digit - 26),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { digit: 25 },
  output: { symbol: "z" },
} satisfies ToolExample<Input, Output>;
export const punycodeDigitToGeneralizedIntegerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/punycode-digit-to-generalized-integer",
    title: "Punycode Digit To Generalized Integer Tool",
    description:
      "Calculate punycode digit to generalized integer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digit: { type: "integer", minimum: 0, maximum: 35 } },
      required: ["digit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symbol: { type: "string", maxLength: 8192 } },
      required: ["symbol"],
    },
    ports: {
      inputs: [
        {
          id: "digit",
          label: "Digit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "symbol", label: "Symbol", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = punycodeDigitToGeneralizedIntegerTool.execute;
export default punycodeDigitToGeneralizedIntegerTool;
