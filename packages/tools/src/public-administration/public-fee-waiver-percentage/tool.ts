import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fee: number; readonly waiverPercent: number };
export type Output = {
  readonly waivedAmount: number;
  readonly payableAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fee: { type: "number", minimum: 0 },
    waiverPercent: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["fee", "waiverPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waivedAmount: { type: "number" },
    payableAmount: { type: "number" },
  },
  required: ["waivedAmount", "payableAmount"],
} as const;
/** Apply an explicitly granted fee-waiver percentage without determining eligibility or rounding currency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fee, waiverPercent } = request;
  const compute = (): Output => {
    H.domain(fee >= 0 && waiverPercent >= 0 && waiverPercent <= 100, "fee");
    return {
      waivedAmount: (fee * waiverPercent) / 100,
      payableAmount: fee * (1 - waiverPercent / 100),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fee: 80, waiverPercent: 25 },
  output: { waivedAmount: 20, payableAmount: 60 },
} satisfies ToolExample<Input, Output>;
export const publicFeeWaiverPercentageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/public-fee-waiver-percentage",
    title: "Public Fee Waiver Percentage Tool",
    description:
      "Apply an explicitly granted fee-waiver percentage without determining eligibility or rounding currency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fee: { type: "number", minimum: 0 },
        waiverPercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: ["fee", "waiverPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waivedAmount: { type: "number" },
        payableAmount: { type: "number" },
      },
      required: ["waivedAmount", "payableAmount"],
    },
    ports: {
      inputs: [
        {
          id: "fee",
          label: "Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waiverPercent",
          label: "Waiver Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waivedAmount",
          label: "Waived Amount",
          valueType: { type: "number" },
        },
        {
          id: "payableAmount",
          label: "Payable Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicFeeWaiverPercentageTool.execute;
export default publicFeeWaiverPercentageTool;
