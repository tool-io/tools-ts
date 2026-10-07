import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proposalAmount: number;
  readonly availableBudget: number;
};
export type Output = {
  readonly budgetShare: number;
  readonly remainingBudget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proposalAmount: { type: "number", minimum: 0 },
    availableBudget: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["proposalAmount", "availableBudget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    budgetShare: { type: "number" },
    remainingBudget: { type: "number" },
  },
  required: ["budgetShare", "remainingBudget"],
} as const;
/** Describe an explicitly costed resident proposal relative to an available budget without selecting or approving the proposal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proposalAmount, availableBudget } = request;
  const compute = (): Output => {
    H.domain(proposalAmount >= 0, "proposalAmount");
    (H.domain(availableBudget > 0, "availableBudget"), availableBudget);
    return {
      budgetShare: proposalAmount / availableBudget,
      remainingBudget: availableBudget - proposalAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { proposalAmount: 2500, availableBudget: 10000 },
  output: { budgetShare: 0.25, remainingBudget: 7500 },
} satisfies ToolExample<Input, Output>;
export const residentProposalBudgetShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/resident-proposal-budget-share",
    title: "Resident Proposal Budget Share",
    description:
      "Describe an explicitly costed resident proposal relative to an available budget without selecting or approving the proposal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proposalAmount: { type: "number", minimum: 0 },
        availableBudget: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["proposalAmount", "availableBudget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        budgetShare: { type: "number" },
        remainingBudget: { type: "number" },
      },
      required: ["budgetShare", "remainingBudget"],
    },
    ports: {
      inputs: [
        {
          id: "proposalAmount",
          label: "Proposal Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableBudget",
          label: "Available Budget",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "budgetShare",
          label: "Budget Share",
          valueType: { type: "number" },
        },
        {
          id: "remainingBudget",
          label: "Remaining Budget",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = residentProposalBudgetShareTool.execute;
export default residentProposalBudgetShareTool;
