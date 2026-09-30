import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reward: number;
  readonly returnedShare: number;
  readonly priorClawback: number;
};
export type Output = {
  readonly totalClawback: number;
  readonly additionalDue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reward: { type: "number", minimum: 0 },
    returnedShare: { type: "number", minimum: 0, maximum: 1 },
    priorClawback: { type: "number", minimum: 0 },
  },
  required: ["reward", "returnedShare", "priorClawback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalClawback: { type: "number" },
    additionalDue: { type: "number" },
  },
  required: ["totalClawback", "additionalDue"],
} as const;
/** Signed adjustment under a supplied proportional reward-return rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reward, returnedShare, priorClawback } = request;
  const compute = (): Output => {
    H.domain(reward >= 0 && priorClawback >= 0);
    H.probability(returnedShare);
    return {
      totalClawback: reward * returnedShare,
      additionalDue: reward * returnedShare - priorClawback,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reward: 100, returnedShare: 0.4, priorClawback: 10 },
  output: { totalClawback: 40, additionalDue: 30 },
} satisfies ToolExample<Input, Output>;
export const referralReturnClawbackTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/referral-return-clawback-term",
    title: "Referral Return Clawback Term Tool",
    description:
      "Signed adjustment under a supplied proportional reward-return rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reward: { type: "number", minimum: 0 },
        returnedShare: { type: "number", minimum: 0, maximum: 1 },
        priorClawback: { type: "number", minimum: 0 },
      },
      required: ["reward", "returnedShare", "priorClawback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalClawback: { type: "number" },
        additionalDue: { type: "number" },
      },
      required: ["totalClawback", "additionalDue"],
    },
    ports: {
      inputs: [
        {
          id: "reward",
          label: "Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedShare",
          label: "Returned Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "priorClawback",
          label: "Prior Clawback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalClawback",
          label: "Total Clawback",
          valueType: { type: "number" },
        },
        {
          id: "additionalDue",
          label: "Additional Due",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referralReturnClawbackTermTool.execute;
export default referralReturnClawbackTermTool;
