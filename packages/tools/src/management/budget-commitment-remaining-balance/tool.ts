import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly budget: number;
  readonly spent: number;
  readonly committedUnspent: number;
};
export type Output = { readonly uncommittedBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    budget: { type: "number", minimum: 0 },
    spent: { type: "number", minimum: 0 },
    committedUnspent: { type: "number", minimum: 0 },
  },
  required: ["budget", "spent", "committedUnspent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uncommittedBalance: { type: "number" } },
  required: ["uncommittedBalance"],
} as const;
/** Subtract actual spend and explicitly unspent commitments from a budget without double-counting commitments already spent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { budget, spent, committedUnspent } = request;
  const compute = (): Output => {
    H.domain(budget >= 0 && spent >= 0 && committedUnspent >= 0, "budget");
    return { uncommittedBalance: budget - spent - committedUnspent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { budget: 10000, spent: 3500, committedUnspent: 2000 },
  output: { uncommittedBalance: 4500 },
} satisfies ToolExample<Input, Output>;
export const budgetCommitmentRemainingBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/budget-commitment-remaining-balance",
    title: "Budget Commitment Remaining Balance Tool",
    description:
      "Subtract actual spend and explicitly unspent commitments from a budget without double-counting commitments already spent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        budget: { type: "number", minimum: 0 },
        spent: { type: "number", minimum: 0 },
        committedUnspent: { type: "number", minimum: 0 },
      },
      required: ["budget", "spent", "committedUnspent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { uncommittedBalance: { type: "number" } },
      required: ["uncommittedBalance"],
    },
    ports: {
      inputs: [
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spent",
          label: "Spent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "committedUnspent",
          label: "Committed Unspent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncommittedBalance",
          label: "Uncommitted Balance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = budgetCommitmentRemainingBalanceTool.execute;
export default budgetCommitmentRemainingBalanceTool;
