import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedFeeBase: number;
  readonly suppliedFeeFraction: number;
  readonly suppliedFixedFee: number;
};
export type Output = { readonly appliedFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedFeeBase: { type: "number", minimum: 0 },
    suppliedFeeFraction: { type: "number", minimum: 0 },
    suppliedFixedFee: { type: "number", minimum: 0 },
  },
  required: ["suppliedFeeBase", "suppliedFeeFraction", "suppliedFixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { appliedFee: { type: "number" } },
  required: ["appliedFee"],
} as const;
/** Apply explicit proportional and fixed fee terms to a supplied rental fee base without determining legality or whether a fee is due. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedFeeBase, suppliedFeeFraction, suppliedFixedFee } = request;
  const compute = (): Output => {
    H.domain(
      suppliedFeeBase >= 0 && suppliedFeeFraction >= 0 && suppliedFixedFee >= 0,
      "suppliedFeeBase",
    );
    return {
      appliedFee: suppliedFeeBase * suppliedFeeFraction + suppliedFixedFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedFeeBase: 500,
    suppliedFeeFraction: 0.02,
    suppliedFixedFee: 5,
  },
  output: { appliedFee: 15 },
} satisfies ToolExample<Input, Output>;
export const rentalPaymentLateFeeBaseApplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/rental-payment-late-fee-base-applier",
    title: "Rental Payment Late Fee Base Applier",
    description:
      "Apply explicit proportional and fixed fee terms to a supplied rental fee base without determining legality or whether a fee is due.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedFeeBase: { type: "number", minimum: 0 },
        suppliedFeeFraction: { type: "number", minimum: 0 },
        suppliedFixedFee: { type: "number", minimum: 0 },
      },
      required: ["suppliedFeeBase", "suppliedFeeFraction", "suppliedFixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { appliedFee: { type: "number" } },
      required: ["appliedFee"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedFeeBase",
          label: "Supplied Fee Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFeeFraction",
          label: "Supplied Fee Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFixedFee",
          label: "Supplied Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "appliedFee",
          label: "Applied Fee",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rentalPaymentLateFeeBaseApplierTool.execute;
export default rentalPaymentLateFeeBaseApplierTool;
