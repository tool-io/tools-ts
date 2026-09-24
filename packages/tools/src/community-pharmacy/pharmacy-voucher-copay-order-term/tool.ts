import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bill: number;
  readonly copay: number;
  readonly voucher: number;
  readonly voucherBeforeCopay: boolean;
};
export type Output = {
  readonly patientPayment: number;
  readonly voucherUsed: number;
  readonly insurerPayment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bill: { type: "number", minimum: 0 },
    copay: { type: "number", minimum: 0 },
    voucher: { type: "number", minimum: 0 },
    voucherBeforeCopay: { type: "boolean" },
  },
  required: ["bill", "copay", "voucher", "voucherBeforeCopay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    patientPayment: { type: "number" },
    voucherUsed: { type: "number" },
    insurerPayment: { type: "number" },
  },
  required: ["patientPayment", "voucherUsed", "insurerPayment"],
} as const;
/** Calculate pharmacy voucher copay order term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bill, copay, voucher, voucherBeforeCopay } = request;
  const compute = (): Output => {
    H.domain(bill >= 0 && copay >= 0 && voucher >= 0);
    return {
      patientPayment: voucherBeforeCopay
        ? Math.min(copay, Math.max(0, bill - voucher))
        : Math.max(0, Math.min(copay, bill) - voucher),
      voucherUsed: voucherBeforeCopay
        ? Math.min(voucher, bill)
        : Math.min(voucher, copay, bill),
      insurerPayment: voucherBeforeCopay
        ? Math.max(0, bill - voucher - copay)
        : Math.max(0, bill - copay),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bill: 100, copay: 20, voucher: 10, voucherBeforeCopay: true },
  output: { patientPayment: 20, voucherUsed: 10, insurerPayment: 70 },
} satisfies ToolExample<Input, Output>;
export const pharmacyVoucherCopayOrderTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/pharmacy-voucher-copay-order-term",
    title: "Pharmacy Voucher Copay Order Term Tool",
    description:
      "Calculate pharmacy voucher copay order term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bill: { type: "number", minimum: 0 },
        copay: { type: "number", minimum: 0 },
        voucher: { type: "number", minimum: 0 },
        voucherBeforeCopay: { type: "boolean" },
      },
      required: ["bill", "copay", "voucher", "voucherBeforeCopay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        patientPayment: { type: "number" },
        voucherUsed: { type: "number" },
        insurerPayment: { type: "number" },
      },
      required: ["patientPayment", "voucherUsed", "insurerPayment"],
    },
    ports: {
      inputs: [
        {
          id: "bill",
          label: "Bill",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "copay",
          label: "Copay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voucher",
          label: "Voucher",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voucherBeforeCopay",
          label: "Voucher Before Copay",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "patientPayment",
          label: "Patient Payment",
          valueType: { type: "number" },
        },
        {
          id: "voucherUsed",
          label: "Voucher Used",
          valueType: { type: "number" },
        },
        {
          id: "insurerPayment",
          label: "Insurer Payment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyVoucherCopayOrderTermTool.execute;
export default pharmacyVoucherCopayOrderTermTool;
