import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleBase: number;
  readonly allowance: number;
  readonly marginalRate: number;
  readonly claimants: number;
};
export type Output = {
  readonly deductiblePerClaimant: number;
  readonly totalExpenditure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleBase: { type: "number", minimum: 0 },
    allowance: { type: "number", minimum: 0 },
    marginalRate: { type: "number", minimum: 0, maximum: 1 },
    claimants: { type: "integer", minimum: 0 },
  },
  required: ["eligibleBase", "allowance", "marginalRate", "claimants"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deductiblePerClaimant: { type: "number" },
    totalExpenditure: { type: "number" },
  },
  required: ["deductiblePerClaimant", "totalExpenditure"],
} as const;
/** Static deduction-times-rate estimate from explicit homogeneous claimant inputs; behavioral effects are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleBase, allowance, marginalRate, claimants } = request;
  const compute = (): Output => {
    H.domain(eligibleBase >= 0 && allowance >= 0);
    H.probability(marginalRate);
    H.integer(claimants, 0);
    return {
      deductiblePerClaimant: Math.min(eligibleBase, allowance),
      totalExpenditure:
        Math.min(eligibleBase, allowance) * marginalRate * claimants,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleBase: 1000,
    allowance: 200,
    marginalRate: 0.25,
    claimants: 100,
  },
  output: { deductiblePerClaimant: 200, totalExpenditure: 5000 },
} satisfies ToolExample<Input, Output>;
export const taxExpenditureOneAllowanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/tax-expenditure-one-allowance-term",
    title: "Tax Expenditure One Allowance Term Tool",
    description:
      "Static deduction-times-rate estimate from explicit homogeneous claimant inputs; behavioral effects are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleBase: { type: "number", minimum: 0 },
        allowance: { type: "number", minimum: 0 },
        marginalRate: { type: "number", minimum: 0, maximum: 1 },
        claimants: { type: "integer", minimum: 0 },
      },
      required: ["eligibleBase", "allowance", "marginalRate", "claimants"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deductiblePerClaimant: { type: "number" },
        totalExpenditure: { type: "number" },
      },
      required: ["deductiblePerClaimant", "totalExpenditure"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleBase",
          label: "Eligible Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowance",
          label: "Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "marginalRate",
          label: "Marginal Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "claimants",
          label: "Claimants",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "deductiblePerClaimant",
          label: "Deductible Per Claimant",
          valueType: { type: "number" },
        },
        {
          id: "totalExpenditure",
          label: "Total Expenditure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxExpenditureOneAllowanceTermTool.execute;
export default taxExpenditureOneAllowanceTermTool;
