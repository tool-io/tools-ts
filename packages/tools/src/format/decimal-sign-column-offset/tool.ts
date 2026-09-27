import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly columnStart: number;
  readonly accountParentheses: boolean;
};
export type Output = {
  readonly signColumns: number;
  readonly firstDigitColumn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    columnStart: { type: "integer" },
    accountParentheses: { type: "boolean" },
  },
  required: ["token", "columnStart", "accountParentheses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signColumns: { type: "integer" },
    firstDigitColumn: { type: "integer" },
  },
  required: ["signColumns", "firstDigitColumn"],
} as const;
/** Locate the first digit column in a supplied decimal sign/accounting-prefix convention without rounding or locale formatting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, columnStart, accountParentheses } = request;
  const compute = (): Output => {
    H.domain(/^[+-]?\d+(?:\.\d+)?(?![\s\S])/.test(token), "token");
    const signColumns = token.startsWith("-") || token.startsWith("+") ? 1 : 0;
    return {
      signColumns,
      firstDigitColumn:
        columnStart +
        (accountParentheses && token.startsWith("-") ? 1 : signColumns),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "-12.5", columnStart: 4, accountParentheses: true },
  output: { signColumns: 1, firstDigitColumn: 5 },
} satisfies ToolExample<Input, Output>;
export const decimalSignColumnOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/decimal-sign-column-offset",
    title: "Decimal Sign Column Offset Tool",
    description:
      "Locate the first digit column in a supplied decimal sign/accounting-prefix convention without rounding or locale formatting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        columnStart: { type: "integer" },
        accountParentheses: { type: "boolean" },
      },
      required: ["token", "columnStart", "accountParentheses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signColumns: { type: "integer" },
        firstDigitColumn: { type: "integer" },
      },
      required: ["signColumns", "firstDigitColumn"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "columnStart",
          label: "Column Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "accountParentheses",
          label: "Account Parentheses",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signColumns",
          label: "Sign Columns",
          valueType: { type: "integer" },
        },
        {
          id: "firstDigitColumn",
          label: "First Digit Column",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = decimalSignColumnOffsetTool.execute;
export default decimalSignColumnOffsetTool;
