import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly negativeZero: boolean;
  readonly accountZero: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    negativeZero: { type: "boolean" },
    accountZero: { type: "boolean" },
  },
  required: ["value", "negativeZero", "accountZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Use accounting parentheses for negative values with a separate explicit negative-zero policy. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, negativeZero, accountZero } = input;
  const compute = (): Output => {
    const negative = value < 0 || (value === 0 && negativeZero && accountZero);
    return { text: negative ? "(" + Math.abs(value) + ")" : String(value) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 0, negativeZero: true, accountZero: true },
  output: { text: "(0)" },
} satisfies ToolExample<Input, Output>;
export const numberParenthesisNegativeZeroPolicyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "format/number-parenthesis-negative-zero-policy",
      title: "Number Parenthesis Negative Zero Policy Tool",
      description:
        "Use accounting parentheses for negative values with a separate explicit negative-zero policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          negativeZero: { type: "boolean" },
          accountZero: { type: "boolean" },
        },
        required: ["value", "negativeZero", "accountZero"],
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
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "negativeZero",
            label: "Negative Zero",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "accountZero",
            label: "Account Zero",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = numberParenthesisNegativeZeroPolicyTool.execute;
export default numberParenthesisNegativeZeroPolicyTool;
