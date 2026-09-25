import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly symbol: string };
export type Output = { readonly digit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digit: { type: "integer" } },
  required: ["digit"],
} as const;
/** Calculate punycode generalized integer digit from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    H.domain(/^[a-zA-Z0-9](?![\s\S])/.test(symbol));
    const n = symbol.toLowerCase().charCodeAt(0);
    return { digit: n >= 97 ? n - 97 : n - 48 + 26 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "z" },
  output: { digit: 25 },
} satisfies ToolExample<Input, Output>;
export const punycodeGeneralizedIntegerDigitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/punycode-generalized-integer-digit",
    title: "Punycode Generalized Integer Digit Tool",
    description:
      "Calculate punycode generalized integer digit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symbol: { type: "string", maxLength: 8192 } },
      required: ["symbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digit: { type: "integer" } },
      required: ["digit"],
    },
    ports: {
      inputs: [
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "digit", label: "Digit", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = punycodeGeneralizedIntegerDigitTool.execute;
export default punycodeGeneralizedIntegerDigitTool;
