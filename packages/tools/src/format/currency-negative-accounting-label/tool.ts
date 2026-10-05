import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly decimalAmount: string;
  readonly currencyToken: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decimalAmount: { type: "string", maxLength: 8192 },
    currencyToken: { type: "string", maxLength: 8192 },
  },
  required: ["decimalAmount", "currencyToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an exact decimal amount with an explicit currency prefix and parentheses for negative nonzero amounts; no locale conversion or rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { decimalAmount, currencyToken } = request;
  const compute = (): Output => {
    H.domain(
      /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?![\s\S])/.test(decimalAmount),
      "decimalAmount",
    );
    H.domain(
      currencyToken.trim().length > 0 && !/[\r\n]/.test(currencyToken),
      "currencyToken",
    );
    const negative =
      decimalAmount.startsWith("-") &&
      !/^-0(?:\.0+)?(?![\s\S])/.test(decimalAmount);
    const amount = decimalAmount.replace(/^-/, "");
    return {
      label: negative
        ? "(" + currencyToken + amount + ")"
        : currencyToken + amount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { decimalAmount: "-1234.50", currencyToken: "$" },
  output: { label: "($1234.50)" },
} satisfies ToolExample<Input, Output>;
export const currencyNegativeAccountingLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/currency-negative-accounting-label",
    title: "Currency Negative Accounting Label Tool",
    description:
      "Format an exact decimal amount with an explicit currency prefix and parentheses for negative nonzero amounts; no locale conversion or rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        decimalAmount: { type: "string", maxLength: 8192 },
        currencyToken: { type: "string", maxLength: 8192 },
      },
      required: ["decimalAmount", "currencyToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "decimalAmount",
          label: "Decimal Amount",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currencyToken",
          label: "Currency Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = currencyNegativeAccountingLabelTool.execute;
export default currencyNegativeAccountingLabelTool;
