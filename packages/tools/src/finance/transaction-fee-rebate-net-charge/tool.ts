import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly grossFee: number; readonly rebate: number };
export type Output = { readonly netFee: number; readonly credit: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFee: { type: "number", minimum: 0 },
    rebate: { type: "number", minimum: 0 },
  },
  required: ["grossFee", "rebate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netFee: { type: "number" }, credit: { type: "boolean" } },
  required: ["netFee", "credit"],
} as const;
/** Net an explicit fee and rebate, retaining negative net charges as credits. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { grossFee, rebate } = input;
  const compute = (): Output => {
    H.domain(grossFee >= 0 && rebate >= 0);
    const netFee = grossFee - rebate;
    return { netFee, credit: netFee < 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { grossFee: 12, rebate: 5 },
  output: { netFee: 7, credit: false },
} satisfies ToolExample<Input, Output>;
export const transactionFeeRebateNetChargeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/transaction-fee-rebate-net-charge",
    title: "Transaction Fee Rebate Net Charge Tool",
    description:
      "Net an explicit fee and rebate, retaining negative net charges as credits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossFee: { type: "number", minimum: 0 },
        rebate: { type: "number", minimum: 0 },
      },
      required: ["grossFee", "rebate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netFee: { type: "number" }, credit: { type: "boolean" } },
      required: ["netFee", "credit"],
    },
    ports: {
      inputs: [
        {
          id: "grossFee",
          label: "Gross Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rebate",
          label: "Rebate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netFee", label: "Net Fee", valueType: { type: "number" } },
        { id: "credit", label: "Credit", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = transactionFeeRebateNetChargeTool.execute;
export default transactionFeeRebateNetChargeTool;
