import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retainedDeposit: number;
  readonly noShowFee: number;
  readonly refundAmount: number;
};
export type Output = { readonly netRevenue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedDeposit: { type: "number", minimum: 0 },
    noShowFee: { type: "number", minimum: 0 },
    refundAmount: { type: "number", minimum: 0 },
  },
  required: ["retainedDeposit", "noShowFee", "refundAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netRevenue: { type: "number" } },
  required: ["netRevenue"],
} as const;
/** Combine explicit retained deposit and separate no-show fee less refund without determining recognition policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retainedDeposit, noShowFee, refundAmount } = request;
  const compute = (): Output => {
    H.domain(retainedDeposit >= 0, "retainedDeposit");
    H.domain(noShowFee >= 0, "noShowFee");
    H.domain(refundAmount >= 0, "refundAmount");
    return { netRevenue: retainedDeposit + noShowFee - refundAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retainedDeposit: 20, noShowFee: 15, refundAmount: 5 },
  output: { netRevenue: 30 },
} satisfies ToolExample<Input, Output>;
export const reservationNoShowNetRevenueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/reservation-no-show-net-revenue",
    title: "Reservation No Show Net Revenue",
    description:
      "Combine explicit retained deposit and separate no-show fee less refund without determining recognition policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedDeposit: { type: "number", minimum: 0 },
        noShowFee: { type: "number", minimum: 0 },
        refundAmount: { type: "number", minimum: 0 },
      },
      required: ["retainedDeposit", "noShowFee", "refundAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netRevenue: { type: "number" } },
      required: ["netRevenue"],
    },
    ports: {
      inputs: [
        {
          id: "retainedDeposit",
          label: "Retained Deposit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "noShowFee",
          label: "No Show Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundAmount",
          label: "Refund Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netRevenue",
          label: "Net Revenue",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservationNoShowNetRevenueTool.execute;
export default reservationNoShowNetRevenueTool;
