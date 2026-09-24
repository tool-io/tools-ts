import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleCost: number;
  readonly suppliedMatchFraction: number;
  readonly securedMatch: number;
  readonly pledgedMatch: number;
  readonly countPledges: boolean;
};
export type Output = { readonly requiredMatch: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCost: { type: "number", minimum: 0 },
    suppliedMatchFraction: { type: "number", minimum: 0, maximum: 1 },
    securedMatch: { type: "number", minimum: 0 },
    pledgedMatch: { type: "number", minimum: 0 },
    countPledges: { type: "boolean" },
  },
  required: [
    "eligibleCost",
    "suppliedMatchFraction",
    "securedMatch",
    "pledgedMatch",
    "countPledges",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredMatch: { type: "number" }, gap: { type: "number" } },
  required: ["requiredMatch", "gap"],
} as const;
/** Apply supplied match-funding assumptions without determining grant eligibility or pledge reliability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    eligibleCost,
    suppliedMatchFraction,
    securedMatch,
    pledgedMatch,
    countPledges,
  } = request;
  const compute = (): Output => {
    H.probability(suppliedMatchFraction);
    H.domain(eligibleCost >= 0 && securedMatch >= 0 && pledgedMatch >= 0);
    return {
      requiredMatch: eligibleCost * suppliedMatchFraction,
      gap:
        eligibleCost * suppliedMatchFraction -
        securedMatch -
        (countPledges ? pledgedMatch : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleCost: 1000,
    suppliedMatchFraction: 0.25,
    securedMatch: 100,
    pledgedMatch: 50,
    countPledges: true,
  },
  output: { requiredMatch: 250, gap: 100 },
} satisfies ToolExample<Input, Output>;
export const communityProjectMatchFundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/community-project-match-funding-gap",
    title: "Community Project Match Funding Gap Tool",
    description:
      "Apply supplied match-funding assumptions without determining grant eligibility or pledge reliability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCost: { type: "number", minimum: 0 },
        suppliedMatchFraction: { type: "number", minimum: 0, maximum: 1 },
        securedMatch: { type: "number", minimum: 0 },
        pledgedMatch: { type: "number", minimum: 0 },
        countPledges: { type: "boolean" },
      },
      required: [
        "eligibleCost",
        "suppliedMatchFraction",
        "securedMatch",
        "pledgedMatch",
        "countPledges",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredMatch: { type: "number" },
        gap: { type: "number" },
      },
      required: ["requiredMatch", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleCost",
          label: "Eligible Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMatchFraction",
          label: "Supplied Match Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "securedMatch",
          label: "Secured Match",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pledgedMatch",
          label: "Pledged Match",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countPledges",
          label: "Count Pledges",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "requiredMatch",
          label: "Required Match",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = communityProjectMatchFundingGapTool.execute;
export default communityProjectMatchFundingGapTool;
