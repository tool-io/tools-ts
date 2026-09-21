import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedCap: number;
  readonly paid: number;
  readonly committed: number;
  readonly countCommitments: boolean;
};
export type Output = {
  readonly countedPayment: number;
  readonly headroom: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCap: { type: "number", minimum: 0 },
    paid: { type: "number", minimum: 0 },
    committed: { type: "number", minimum: 0 },
    countCommitments: { type: "boolean" },
  },
  required: ["suppliedCap", "paid", "committed", "countCommitments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedPayment: { type: "number" },
    headroom: { type: "number" },
  },
  required: ["countedPayment", "headroom"],
} as const;
/** Compare supplied agricultural payment ledger entries against an explicit cap without determining entitlement or legal limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedCap, paid, committed, countCommitments } = request;
  const compute = (): Output => {
    H.domain(suppliedCap >= 0 && paid >= 0 && committed >= 0);
    return {
      countedPayment: paid + (countCommitments ? committed : 0),
      headroom: suppliedCap - paid - (countCommitments ? committed : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedCap: 100, paid: 60, committed: 20, countCommitments: true },
  output: { countedPayment: 80, headroom: 20 },
} satisfies ToolExample<Input, Output>;
export const paymentCapHeadroomTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "agricultural-policy/payment-cap-headroom",
    title: "Payment Cap Headroom Tool",
    description:
      "Compare supplied agricultural payment ledger entries against an explicit cap without determining entitlement or legal limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedCap: { type: "number", minimum: 0 },
        paid: { type: "number", minimum: 0 },
        committed: { type: "number", minimum: 0 },
        countCommitments: { type: "boolean" },
      },
      required: ["suppliedCap", "paid", "committed", "countCommitments"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedPayment: { type: "number" },
        headroom: { type: "number" },
      },
      required: ["countedPayment", "headroom"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paid",
          label: "Paid",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "committed",
          label: "Committed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countCommitments",
          label: "Count Commitments",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedPayment",
          label: "Counted Payment",
          valueType: { type: "number" },
        },
        { id: "headroom", label: "Headroom", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = paymentCapHeadroomTool.execute;
export default paymentCapHeadroomTool;
