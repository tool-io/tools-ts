import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly decimals: number;
  readonly trailingZeros: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decimals: { type: "integer" },
    trailingZeros: { type: "integer" },
  },
  required: ["decimals", "trailingZeros"],
} as const;
/** Count explicit decimal places and terminal decimal zeros from a decimal token without numeric coercion. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    H.domain(/^[+-]?\d+\.\d+(?![\s\S])/.test(token));
    const fraction = token.split(".")[1];
    return {
      decimals: fraction.length,
      trailingZeros: fraction.length - fraction.replace(/0+$/, "").length,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "12.3400" },
  output: { decimals: 4, trailingZeros: 2 },
} satisfies ToolExample<Input, Output>;
export const decimalTrailingZeroSignificanceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/decimal-trailing-zero-significance-tag",
    title: "Decimal Trailing Zero Significance Tag Tool",
    description:
      "Count explicit decimal places and terminal decimal zeros from a decimal token without numeric coercion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        decimals: { type: "integer" },
        trailingZeros: { type: "integer" },
      },
      required: ["decimals", "trailingZeros"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "decimals", label: "Decimals", valueType: { type: "integer" } },
        {
          id: "trailingZeros",
          label: "Trailing Zeros",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = decimalTrailingZeroSignificanceTagTool.execute;
export default decimalTrailingZeroSignificanceTagTool;
