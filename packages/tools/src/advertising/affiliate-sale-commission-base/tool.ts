import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly saleSubtotal: number;
  readonly excludedCharges: number;
  readonly commissionFraction: number;
};
export type Output = {
  readonly commissionableBase: number;
  readonly commission: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saleSubtotal: { type: "number", minimum: 0 },
    excludedCharges: { type: "number", minimum: 0 },
    commissionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["saleSubtotal", "excludedCharges", "commissionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commissionableBase: { type: "number" },
    commission: { type: "number" },
  },
  required: ["commissionableBase", "commission"],
} as const;
/** Apply a supplied affiliate commission fraction after explicit exclusions from the sale subtotal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { saleSubtotal, excludedCharges, commissionFraction } = request;
  const compute = (): Output => {
    H.domain(
      saleSubtotal >= 0 &&
        excludedCharges >= 0 &&
        excludedCharges <= saleSubtotal,
      "saleSubtotal",
    );
    (H.domain(
      commissionFraction >= 0 && commissionFraction <= 1,
      "commissionFraction",
    ),
      commissionFraction);
    return {
      commissionableBase: saleSubtotal - excludedCharges,
      commission: (saleSubtotal - excludedCharges) * commissionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { saleSubtotal: 120, excludedCharges: 20, commissionFraction: 0.1 },
  output: { commissionableBase: 100, commission: 10 },
} satisfies ToolExample<Input, Output>;
export const affiliateSaleCommissionBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/affiliate-sale-commission-base",
    title: "Affiliate Sale Commission Base Tool",
    description:
      "Apply a supplied affiliate commission fraction after explicit exclusions from the sale subtotal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saleSubtotal: { type: "number", minimum: 0 },
        excludedCharges: { type: "number", minimum: 0 },
        commissionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["saleSubtotal", "excludedCharges", "commissionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commissionableBase: { type: "number" },
        commission: { type: "number" },
      },
      required: ["commissionableBase", "commission"],
    },
    ports: {
      inputs: [
        {
          id: "saleSubtotal",
          label: "Sale Subtotal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedCharges",
          label: "Excluded Charges",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commissionFraction",
          label: "Commission Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "commissionableBase",
          label: "Commissionable Base",
          valueType: { type: "number" },
        },
        {
          id: "commission",
          label: "Commission",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = affiliateSaleCommissionBaseTool.execute;
export default affiliateSaleCommissionBaseTool;
