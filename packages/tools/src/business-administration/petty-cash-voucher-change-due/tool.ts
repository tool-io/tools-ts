import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashAdvanced: number;
  readonly voucherSpend: number;
};
export type Output = { readonly changeDue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashAdvanced: { type: "number", minimum: 0 },
    voucherSpend: { type: "number", minimum: 0 },
  },
  required: ["cashAdvanced", "voucherSpend"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { changeDue: { type: "number" } },
  required: ["changeDue"],
} as const;
/** Subtract an explicit voucher spend from petty cash advanced, preserving a negative reimbursement balance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashAdvanced, voucherSpend } = request;
  const compute = (): Output => {
    H.domain(cashAdvanced >= 0, "cashAdvanced");
    H.domain(voucherSpend >= 0, "voucherSpend");
    return { changeDue: cashAdvanced - voucherSpend };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashAdvanced: 100, voucherSpend: 72 },
  output: { changeDue: 28 },
} satisfies ToolExample<Input, Output>;
export const pettyCashVoucherChangeDueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/petty-cash-voucher-change-due",
    title: "Petty Cash Voucher Change Due",
    description:
      "Subtract an explicit voucher spend from petty cash advanced, preserving a negative reimbursement balance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashAdvanced: { type: "number", minimum: 0 },
        voucherSpend: { type: "number", minimum: 0 },
      },
      required: ["cashAdvanced", "voucherSpend"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { changeDue: { type: "number" } },
      required: ["changeDue"],
    },
    ports: {
      inputs: [
        {
          id: "cashAdvanced",
          label: "Cash Advanced",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voucherSpend",
          label: "Voucher Spend",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "changeDue", label: "Change Due", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pettyCashVoucherChangeDueTool.execute;
export default pettyCashVoucherChangeDueTool;
