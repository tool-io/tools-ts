import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repairCost: number;
  readonly borrowerFraction: number;
};
export type Output = {
  readonly borrowerCost: number;
  readonly communityCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repairCost: { type: "number", minimum: 0 },
    borrowerFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["repairCost", "borrowerFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    borrowerCost: { type: "number" },
    communityCost: { type: "number" },
  },
  required: ["borrowerCost", "communityCost"],
} as const;
/** Split supplied community-lending repair cost with an explicit borrower fraction without determining responsibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repairCost, borrowerFraction } = request;
  const compute = (): Output => {
    H.domain(repairCost >= 0, "repairCost");
    (H.domain(
      borrowerFraction >= 0 && borrowerFraction <= 1,
      "borrowerFraction",
    ),
      borrowerFraction);
    return {
      borrowerCost: repairCost * borrowerFraction,
      communityCost: repairCost * (1 - borrowerFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { repairCost: 80, borrowerFraction: 0.25 },
  output: { borrowerCost: 20, communityCost: 60 },
} satisfies ToolExample<Input, Output>;
export const communityLendingRepairCostSplitTool = H.defineSchemaCalculation<
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
    id: "community-development/community-lending-repair-cost-split",
    title: "Community Lending Repair Cost Split",
    description:
      "Split supplied community-lending repair cost with an explicit borrower fraction without determining responsibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repairCost: { type: "number", minimum: 0 },
        borrowerFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["repairCost", "borrowerFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        borrowerCost: { type: "number" },
        communityCost: { type: "number" },
      },
      required: ["borrowerCost", "communityCost"],
    },
    ports: {
      inputs: [
        {
          id: "repairCost",
          label: "Repair Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "borrowerFraction",
          label: "Borrower Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "borrowerCost",
          label: "Borrower Cost",
          valueType: { type: "number" },
        },
        {
          id: "communityCost",
          label: "Community Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityLendingRepairCostSplitTool.execute;
export default communityLendingRepairCostSplitTool;
