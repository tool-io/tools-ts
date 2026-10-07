import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchProbability: number;
  readonly suppliedUtility: number;
};
export type Output = { readonly expectedUtilityContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchProbability: { type: "number", minimum: 0, maximum: 1 },
    suppliedUtility: { type: "number" },
  },
  required: ["branchProbability", "suppliedUtility"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedUtilityContribution: { type: "number" } },
  required: ["expectedUtilityContribution"],
} as const;
/** Multiply an explicit lottery branch probability by caller-supplied signed utility without choosing a utility function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchProbability, suppliedUtility } = request;
  const compute = (): Output => {
    (H.domain(
      branchProbability >= 0 && branchProbability <= 1,
      "branchProbability",
    ),
      branchProbability);
    return { expectedUtilityContribution: branchProbability * suppliedUtility };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchProbability: 0.25, suppliedUtility: 20 },
  output: { expectedUtilityContribution: 5 },
} satisfies ToolExample<Input, Output>;
export const lotteryBranchWeightedUtilityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/lottery-branch-weighted-utility-term",
    title: "Lottery Branch Weighted Utility Term",
    description:
      "Multiply an explicit lottery branch probability by caller-supplied signed utility without choosing a utility function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchProbability: { type: "number", minimum: 0, maximum: 1 },
        suppliedUtility: { type: "number" },
      },
      required: ["branchProbability", "suppliedUtility"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expectedUtilityContribution: { type: "number" } },
      required: ["expectedUtilityContribution"],
    },
    ports: {
      inputs: [
        {
          id: "branchProbability",
          label: "Branch Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUtility",
          label: "Supplied Utility",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedUtilityContribution",
          label: "Expected Utility Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lotteryBranchWeightedUtilityTermTool.execute;
export default lotteryBranchWeightedUtilityTermTool;
