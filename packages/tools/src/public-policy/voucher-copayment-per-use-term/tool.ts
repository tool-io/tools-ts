import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly uses: number;
  readonly pricePerUse: number;
  readonly voucherPerUse: number;
};
export type Output = {
  readonly subsidy: number;
  readonly householdCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uses: { type: "integer", minimum: 0 },
    pricePerUse: { type: "number", minimum: 0 },
    voucherPerUse: { type: "number", minimum: 0 },
  },
  required: ["uses", "pricePerUse", "voucherPerUse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsidy: { type: "number" },
    householdCost: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["subsidy", "householdCost", "totalCost"],
} as const;
/** Calculate voucher copayment per use term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uses, pricePerUse, voucherPerUse } = request;
  const compute = (): Output => {
    H.integer(uses, 0);
    H.domain(pricePerUse >= 0 && voucherPerUse >= 0);
    return {
      subsidy: uses * Math.min(pricePerUse, voucherPerUse),
      householdCost: uses * Math.max(0, pricePerUse - voucherPerUse),
      totalCost: uses * pricePerUse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { uses: 10, pricePerUse: 20, voucherPerUse: 12 },
  output: { subsidy: 120, householdCost: 80, totalCost: 200 },
} satisfies ToolExample<Input, Output>;
export const voucherCopaymentPerUseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/voucher-copayment-per-use-term",
    title: "Voucher Copayment Per Use Term Tool",
    description:
      "Calculate voucher copayment per use term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uses: { type: "integer", minimum: 0 },
        pricePerUse: { type: "number", minimum: 0 },
        voucherPerUse: { type: "number", minimum: 0 },
      },
      required: ["uses", "pricePerUse", "voucherPerUse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subsidy: { type: "number" },
        householdCost: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["subsidy", "householdCost", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "uses",
          label: "Uses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pricePerUse",
          label: "Price Per Use",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voucherPerUse",
          label: "Voucher Per Use",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "subsidy", label: "Subsidy", valueType: { type: "number" } },
        {
          id: "householdCost",
          label: "Household Cost",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = voucherCopaymentPerUseTermTool.execute;
export default voucherCopaymentPerUseTermTool;
