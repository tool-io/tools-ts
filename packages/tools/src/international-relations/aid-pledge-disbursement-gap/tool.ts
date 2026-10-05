import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pledgedAmount: number;
  readonly disbursedAmount: number;
};
export type Output = {
  readonly undisbursedAmount: number;
  readonly disbursementShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pledgedAmount: { type: "number", exclusiveMinimum: 0 },
    disbursedAmount: { type: "number", minimum: 0 },
  },
  required: ["pledgedAmount", "disbursedAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    undisbursedAmount: { type: "number" },
    disbursementShare: { type: "number" },
  },
  required: ["undisbursedAmount", "disbursementShare"],
} as const;
/** Compare a positive aid pledge with actual disbursement in the same currency and period; over-disbursement remains visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pledgedAmount, disbursedAmount } = request;
  const compute = (): Output => {
    (H.domain(pledgedAmount > 0, "pledgedAmount"), pledgedAmount);
    H.domain(disbursedAmount >= 0, "disbursedAmount");
    return {
      undisbursedAmount: pledgedAmount - disbursedAmount,
      disbursementShare: disbursedAmount / pledgedAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pledgedAmount: 100, disbursedAmount: 65 },
  output: { undisbursedAmount: 35, disbursementShare: 0.65 },
} satisfies ToolExample<Input, Output>;
export const aidPledgeDisbursementGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/aid-pledge-disbursement-gap",
    title: "Aid Pledge Disbursement Gap Tool",
    description:
      "Compare a positive aid pledge with actual disbursement in the same currency and period; over-disbursement remains visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pledgedAmount: { type: "number", exclusiveMinimum: 0 },
        disbursedAmount: { type: "number", minimum: 0 },
      },
      required: ["pledgedAmount", "disbursedAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        undisbursedAmount: { type: "number" },
        disbursementShare: { type: "number" },
      },
      required: ["undisbursedAmount", "disbursementShare"],
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
          id: "disbursedAmount",
          label: "Disbursed Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "undisbursedAmount",
          label: "Undisbursed Amount",
          valueType: { type: "number" },
        },
        {
          id: "disbursementShare",
          label: "Disbursement Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aidPledgeDisbursementGapTool.execute;
export default aidPledgeDisbursementGapTool;
