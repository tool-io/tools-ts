import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pledges: number;
  readonly platformFraction: number;
  readonly rewards: number;
  readonly unitCost: number;
  readonly shippingPerReward: number;
  readonly fixedCost: number;
};
export type Output = {
  readonly netProceeds: number;
  readonly fulfillmentCost: number;
  readonly surplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pledges: { type: "number", minimum: 0 },
    platformFraction: { type: "number", minimum: 0, maximum: 1 },
    rewards: { type: "integer", minimum: 0 },
    unitCost: { type: "number", minimum: 0 },
    shippingPerReward: { type: "number", minimum: 0 },
    fixedCost: { type: "number", minimum: 0 },
  },
  required: [
    "pledges",
    "platformFraction",
    "rewards",
    "unitCost",
    "shippingPerReward",
    "fixedCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netProceeds: { type: "number" },
    fulfillmentCost: { type: "number" },
    surplus: { type: "number" },
  },
  required: ["netProceeds", "fulfillmentCost", "surplus"],
} as const;
/** Calculate crowdfunding reward fulfillment net margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    pledges,
    platformFraction,
    rewards,
    unitCost,
    shippingPerReward,
    fixedCost,
  } = request;
  const compute = (): Output => {
    H.domain(
      pledges >= 0 && unitCost >= 0 && shippingPerReward >= 0 && fixedCost >= 0,
    );
    H.probability(platformFraction);
    H.integer(rewards, 0);
    return {
      netProceeds: pledges * (1 - platformFraction),
      fulfillmentCost: rewards * (unitCost + shippingPerReward) + fixedCost,
      surplus:
        pledges * (1 - platformFraction) -
        rewards * (unitCost + shippingPerReward) -
        fixedCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pledges: 10000,
    platformFraction: 0.05,
    rewards: 100,
    unitCost: 40,
    shippingPerReward: 10,
    fixedCost: 1000,
  },
  output: { netProceeds: 9500, fulfillmentCost: 6000, surplus: 3500 },
} satisfies ToolExample<Input, Output>;
export const crowdfundingRewardFulfillmentNetMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entrepreneurship-studies/crowdfunding-reward-fulfillment-net-margin",
      title: "Crowdfunding Reward Fulfillment Net Margin Tool",
      description:
        "Calculate crowdfunding reward fulfillment net margin from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pledges: { type: "number", minimum: 0 },
          platformFraction: { type: "number", minimum: 0, maximum: 1 },
          rewards: { type: "integer", minimum: 0 },
          unitCost: { type: "number", minimum: 0 },
          shippingPerReward: { type: "number", minimum: 0 },
          fixedCost: { type: "number", minimum: 0 },
        },
        required: [
          "pledges",
          "platformFraction",
          "rewards",
          "unitCost",
          "shippingPerReward",
          "fixedCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netProceeds: { type: "number" },
          fulfillmentCost: { type: "number" },
          surplus: { type: "number" },
        },
        required: ["netProceeds", "fulfillmentCost", "surplus"],
      },
      ports: {
        inputs: [
          {
            id: "pledges",
            label: "Pledges",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "platformFraction",
            label: "Platform Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rewards",
            label: "Rewards",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unitCost",
            label: "Unit Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "shippingPerReward",
            label: "Shipping Per Reward",
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
            id: "netProceeds",
            label: "Net Proceeds",
            valueType: { type: "number" },
          },
          {
            id: "fulfillmentCost",
            label: "Fulfillment Cost",
            valueType: { type: "number" },
          },
          { id: "surplus", label: "Surplus", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = crowdfundingRewardFulfillmentNetMarginTool.execute;
export default crowdfundingRewardFulfillmentNetMarginTool;
