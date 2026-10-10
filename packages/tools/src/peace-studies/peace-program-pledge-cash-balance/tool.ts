import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pledgedAmount: number;
  readonly receivedAmount: number;
  readonly refundedAmount: number;
};
export type Output = {
  readonly netReceived: number;
  readonly pledgeRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pledgedAmount: { type: "number", minimum: 0 },
    receivedAmount: { type: "number", minimum: 0 },
    refundedAmount: { type: "number", minimum: 0 },
  },
  required: ["pledgedAmount", "receivedAmount", "refundedAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netReceived: { type: "number" },
    pledgeRemaining: { type: "number" },
  },
  required: ["netReceived", "pledgeRemaining"],
} as const;
/** Reconcile explicit program pledge, received cash, and refund amounts in one currency without assessing program effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pledgedAmount, receivedAmount, refundedAmount } = request;
  const compute = (): Output => {
    H.domain(
      pledgedAmount >= 0 && receivedAmount >= 0 && refundedAmount >= 0,
      "pledgedAmount",
    );
    return {
      netReceived: receivedAmount - refundedAmount,
      pledgeRemaining: pledgedAmount - receivedAmount + refundedAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pledgedAmount: 1000, receivedAmount: 600, refundedAmount: 50 },
  output: { netReceived: 550, pledgeRemaining: 450 },
} satisfies ToolExample<Input, Output>;
export const peaceProgramPledgeCashBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["peace-studies", "peace studies", "social sciences"],
      keywords: ["peace studies", "social sciences"],
    },
    id: "peace-studies/peace-program-pledge-cash-balance",
    title: "Peace Program Pledge Cash Balance",
    description:
      "Reconcile explicit program pledge, received cash, and refund amounts in one currency without assessing program effectiveness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pledgedAmount: { type: "number", minimum: 0 },
        receivedAmount: { type: "number", minimum: 0 },
        refundedAmount: { type: "number", minimum: 0 },
      },
      required: ["pledgedAmount", "receivedAmount", "refundedAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netReceived: { type: "number" },
        pledgeRemaining: { type: "number" },
      },
      required: ["netReceived", "pledgeRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "pledgedAmount",
          label: "Pledged Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedAmount",
          label: "Received Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundedAmount",
          label: "Refunded Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netReceived",
          label: "Net Received",
          valueType: { type: "number" },
        },
        {
          id: "pledgeRemaining",
          label: "Pledge Remaining",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = peaceProgramPledgeCashBalanceTool.execute;
export default peaceProgramPledgeCashBalanceTool;
