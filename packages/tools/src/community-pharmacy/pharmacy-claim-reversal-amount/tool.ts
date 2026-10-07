import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalClaimAmount: number;
  readonly reversalAmount: number;
};
export type Output = { readonly remainingClaimAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalClaimAmount: { type: "number", minimum: 0 },
    reversalAmount: { type: "number", minimum: 0 },
  },
  required: ["originalClaimAmount", "reversalAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingClaimAmount: { type: "number" } },
  required: ["remainingClaimAmount"],
} as const;
/** Subtract explicit claim reversal amounts in the same currency, preserving an over-reversal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalClaimAmount, reversalAmount } = request;
  const compute = (): Output => {
    H.domain(
      originalClaimAmount >= 0 && reversalAmount >= 0,
      "originalClaimAmount",
    );
    return { remainingClaimAmount: originalClaimAmount - reversalAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalClaimAmount: 45, reversalAmount: 12 },
  output: { remainingClaimAmount: 33 },
} satisfies ToolExample<Input, Output>;
export const pharmacyClaimReversalAmountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/pharmacy-claim-reversal-amount",
    title: "Pharmacy Claim Reversal Amount",
    description:
      "Subtract explicit claim reversal amounts in the same currency, preserving an over-reversal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalClaimAmount: { type: "number", minimum: 0 },
        reversalAmount: { type: "number", minimum: 0 },
      },
      required: ["originalClaimAmount", "reversalAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingClaimAmount: { type: "number" } },
      required: ["remainingClaimAmount"],
    },
    ports: {
      inputs: [
        {
          id: "originalClaimAmount",
          label: "Original Claim Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reversalAmount",
          label: "Reversal Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingClaimAmount",
          label: "Remaining Claim Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyClaimReversalAmountTool.execute;
export default pharmacyClaimReversalAmountTool;
