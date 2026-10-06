import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMemberSale: number;
  readonly cooperativeFeeFraction: number;
  readonly advancesPaid: number;
};
export type Output = {
  readonly cooperativeFee: number;
  readonly netSettlement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMemberSale: { type: "number", minimum: 0 },
    cooperativeFeeFraction: { type: "number", minimum: 0, maximum: 1 },
    advancesPaid: { type: "number", minimum: 0 },
  },
  required: ["grossMemberSale", "cooperativeFeeFraction", "advancesPaid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cooperativeFee: { type: "number" },
    netSettlement: { type: "number" },
  },
  required: ["cooperativeFee", "netSettlement"],
} as const;
/** Settle a cooperative member sale after an explicit fee and already-paid advances, preserving a negative remaining balance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMemberSale, cooperativeFeeFraction, advancesPaid } = request;
  const compute = (): Output => {
    H.domain(grossMemberSale >= 0 && advancesPaid >= 0, "grossMemberSale");
    (H.domain(
      cooperativeFeeFraction >= 0 && cooperativeFeeFraction <= 1,
      "cooperativeFeeFraction",
    ),
      cooperativeFeeFraction);
    return {
      cooperativeFee: grossMemberSale * cooperativeFeeFraction,
      netSettlement:
        grossMemberSale * (1 - cooperativeFeeFraction) - advancesPaid,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMemberSale: 2000,
    cooperativeFeeFraction: 0.05,
    advancesPaid: 500,
  },
  output: { cooperativeFee: 100, netSettlement: 1400 },
} satisfies ToolExample<Input, Output>;
export const coopSaleMemberSettlementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/coop-sale-member-settlement",
    title: "Coop Sale Member Settlement",
    description:
      "Settle a cooperative member sale after an explicit fee and already-paid advances, preserving a negative remaining balance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMemberSale: { type: "number", minimum: 0 },
        cooperativeFeeFraction: { type: "number", minimum: 0, maximum: 1 },
        advancesPaid: { type: "number", minimum: 0 },
      },
      required: ["grossMemberSale", "cooperativeFeeFraction", "advancesPaid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cooperativeFee: { type: "number" },
        netSettlement: { type: "number" },
      },
      required: ["cooperativeFee", "netSettlement"],
    },
    ports: {
      inputs: [
        {
          id: "grossMemberSale",
          label: "Gross Member Sale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cooperativeFeeFraction",
          label: "Cooperative Fee Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "advancesPaid",
          label: "Advances Paid",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cooperativeFee",
          label: "Cooperative Fee",
          valueType: { type: "number" },
        },
        {
          id: "netSettlement",
          label: "Net Settlement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coopSaleMemberSettlementTool.execute;
export default coopSaleMemberSettlementTool;
