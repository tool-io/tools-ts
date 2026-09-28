import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cap: number;
  readonly reimbursed: number;
  readonly committed: number;
};
export type Output = { readonly remaining: number; readonly available: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cap: { type: "number", minimum: 0 },
    reimbursed: { type: "number", minimum: 0 },
    committed: { type: "number", minimum: 0 },
  },
  required: ["cap", "reimbursed", "committed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, available: { type: "number" } },
  required: ["remaining", "available"],
} as const;
/** Calculate reimbursement cap remaining amount from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cap, reimbursed, committed } = request;
  const compute = (): Output => {
    H.domain(cap >= 0 && reimbursed >= 0 && committed >= 0);
    return {
      remaining: cap - reimbursed - committed,
      available: Math.max(0, cap - reimbursed - committed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cap: 100, reimbursed: 60, committed: 20 },
  output: { remaining: 20, available: 20 },
} satisfies ToolExample<Input, Output>;
export const reimbursementCapRemainingAmountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/reimbursement-cap-remaining-amount",
    title: "Reimbursement Cap Remaining Amount Tool",
    description:
      "Calculate reimbursement cap remaining amount from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cap: { type: "number", minimum: 0 },
        reimbursed: { type: "number", minimum: 0 },
        committed: { type: "number", minimum: 0 },
      },
      required: ["cap", "reimbursed", "committed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        available: { type: "number" },
      },
      required: ["remaining", "available"],
    },
    ports: {
      inputs: [
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reimbursed",
          label: "Reimbursed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "committed",
          label: "Committed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "available", label: "Available", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reimbursementCapRemainingAmountTool.execute;
export default reimbursementCapRemainingAmountTool;
