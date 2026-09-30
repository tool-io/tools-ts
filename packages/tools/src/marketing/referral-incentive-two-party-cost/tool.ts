import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referrals: number;
  readonly qualificationFraction: number;
  readonly referrerReward: number;
  readonly refereeReward: number;
  readonly fixedCost: number;
};
export type Output = {
  readonly qualifiedExpected: number;
  readonly incentiveCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referrals: { type: "integer", minimum: 0 },
    qualificationFraction: { type: "number", minimum: 0, maximum: 1 },
    referrerReward: { type: "number", minimum: 0 },
    refereeReward: { type: "number", minimum: 0 },
    fixedCost: { type: "number", minimum: 0 },
  },
  required: [
    "referrals",
    "qualificationFraction",
    "referrerReward",
    "refereeReward",
    "fixedCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    qualifiedExpected: { type: "number" },
    incentiveCost: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["qualifiedExpected", "incentiveCost", "totalCost"],
} as const;
/** Calculate referral incentive two party cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    referrals,
    qualificationFraction,
    referrerReward,
    refereeReward,
    fixedCost,
  } = request;
  const compute = (): Output => {
    H.integer(referrals, 0);
    H.probability(qualificationFraction);
    H.domain(referrerReward >= 0 && refereeReward >= 0 && fixedCost >= 0);
    return {
      qualifiedExpected: referrals * qualificationFraction,
      incentiveCost:
        referrals * qualificationFraction * (referrerReward + refereeReward),
      totalCost:
        referrals * qualificationFraction * (referrerReward + refereeReward) +
        fixedCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referrals: 100,
    qualificationFraction: 0.5,
    referrerReward: 10,
    refereeReward: 5,
    fixedCost: 100,
  },
  output: { qualifiedExpected: 50, incentiveCost: 750, totalCost: 850 },
} satisfies ToolExample<Input, Output>;
export const referralIncentiveTwoPartyCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/referral-incentive-two-party-cost",
    title: "Referral Incentive Two Party Cost Tool",
    description:
      "Calculate referral incentive two party cost from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referrals: { type: "integer", minimum: 0 },
        qualificationFraction: { type: "number", minimum: 0, maximum: 1 },
        referrerReward: { type: "number", minimum: 0 },
        refereeReward: { type: "number", minimum: 0 },
        fixedCost: { type: "number", minimum: 0 },
      },
      required: [
        "referrals",
        "qualificationFraction",
        "referrerReward",
        "refereeReward",
        "fixedCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        qualifiedExpected: { type: "number" },
        incentiveCost: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["qualifiedExpected", "incentiveCost", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "referrals",
          label: "Referrals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "qualificationFraction",
          label: "Qualification Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referrerReward",
          label: "Referrer Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refereeReward",
          label: "Referee Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedCost",
          label: "Fixed Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "qualifiedExpected",
          label: "Qualified Expected",
          valueType: { type: "number" },
        },
        {
          id: "incentiveCost",
          label: "Incentive Cost",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = referralIncentiveTwoPartyCostTool.execute;
export default referralIncentiveTwoPartyCostTool;
