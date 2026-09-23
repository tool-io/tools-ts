import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly netPrice: number;
  readonly goodsCost: number;
  readonly fulfillmentFixed: number;
  readonly fulfillmentPercent: number;
  readonly paymentFee: number;
};
export type Output = {
  readonly fulfillmentCost: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPrice: { type: "number", minimum: 0 },
    goodsCost: { type: "number", minimum: 0 },
    fulfillmentFixed: { type: "number", minimum: 0 },
    fulfillmentPercent: { type: "number", minimum: 0, maximum: 1 },
    paymentFee: { type: "number", minimum: 0 },
  },
  required: [
    "netPrice",
    "goodsCost",
    "fulfillmentFixed",
    "fulfillmentPercent",
    "paymentFee",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fulfillmentCost: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["fulfillmentCost", "contribution"],
} as const;
/** Calculate unit economics fulfillment fee contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    netPrice,
    goodsCost,
    fulfillmentFixed,
    fulfillmentPercent,
    paymentFee,
  } = request;
  const compute = (): Output => {
    H.domain(
      netPrice >= 0 &&
        goodsCost >= 0 &&
        fulfillmentFixed >= 0 &&
        paymentFee >= 0,
    );
    H.probability(fulfillmentPercent);
    return {
      fulfillmentCost: fulfillmentFixed + netPrice * fulfillmentPercent,
      contribution:
        netPrice -
        goodsCost -
        fulfillmentFixed -
        netPrice * fulfillmentPercent -
        paymentFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    netPrice: 100,
    goodsCost: 40,
    fulfillmentFixed: 5,
    fulfillmentPercent: 0.1,
    paymentFee: 3,
  },
  output: { fulfillmentCost: 15, contribution: 42 },
} satisfies ToolExample<Input, Output>;
export const unitEconomicsFulfillmentFeeContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/unit-economics-fulfillment-fee-contribution",
      title: "Unit Economics Fulfillment Fee Contribution Tool",
      description:
        "Calculate unit economics fulfillment fee contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netPrice: { type: "number", minimum: 0 },
          goodsCost: { type: "number", minimum: 0 },
          fulfillmentFixed: { type: "number", minimum: 0 },
          fulfillmentPercent: { type: "number", minimum: 0, maximum: 1 },
          paymentFee: { type: "number", minimum: 0 },
        },
        required: [
          "netPrice",
          "goodsCost",
          "fulfillmentFixed",
          "fulfillmentPercent",
          "paymentFee",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fulfillmentCost: { type: "number" },
          contribution: { type: "number" },
        },
        required: ["fulfillmentCost", "contribution"],
      },
      ports: {
        inputs: [
          {
            id: "netPrice",
            label: "Net Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "goodsCost",
            label: "Goods Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fulfillmentFixed",
            label: "Fulfillment Fixed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fulfillmentPercent",
            label: "Fulfillment Percent",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paymentFee",
            label: "Payment Fee",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fulfillmentCost",
            label: "Fulfillment Cost",
            valueType: { type: "number" },
          },
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = unitEconomicsFulfillmentFeeContributionTool.execute;
export default unitEconomicsFulfillmentFeeContributionTool;
