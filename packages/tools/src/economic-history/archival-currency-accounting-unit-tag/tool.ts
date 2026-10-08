import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ledgerId: string;
  readonly amountText: string;
  readonly accountingUnitSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ledgerId: { type: "string", maxLength: 8192, minLength: 1 },
    amountText: { type: "string", maxLength: 8192, minLength: 1 },
    accountingUnitSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ledgerId", "amountText", "accountingUnitSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit archival currency transcription and accounting-unit source without exchange-rate or subunit inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ledgerId, amountText, accountingUnitSource } = request;
  const compute = (): Output => {
    H.domain(ledgerId.length > 0, "ledgerId");
    H.domain(amountText.length > 0, "amountText");
    H.domain(accountingUnitSource.length > 0, "accountingUnitSource");
    return {
      token: JSON.stringify([ledgerId, amountText, accountingUnitSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ledgerId: "L17",
    amountText: "3:12:6",
    accountingUnitSource: "source convention C4",
  },
  output: { token: '["L17","3:12:6","source convention C4"]' },
} satisfies ToolExample<Input, Output>;
export const archivalCurrencyAccountingUnitTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/archival-currency-accounting-unit-tag",
    title: "Archival Currency Accounting Unit Tag Tool",
    description:
      "Preserve an explicit archival currency transcription and accounting-unit source without exchange-rate or subunit inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ledgerId: { type: "string", maxLength: 8192, minLength: 1 },
        amountText: { type: "string", maxLength: 8192, minLength: 1 },
        accountingUnitSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["ledgerId", "amountText", "accountingUnitSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "ledgerId",
          label: "Ledger Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "amountText",
          label: "Amount Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accountingUnitSource",
          label: "Accounting Unit Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = archivalCurrencyAccountingUnitTagTool.execute;
export default archivalCurrencyAccountingUnitTagTool;
