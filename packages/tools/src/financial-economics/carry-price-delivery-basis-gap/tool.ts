import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spotPrice: number;
  readonly storageCost: number;
  readonly financingCost: number;
  readonly benefit: number;
  readonly deliveryPrice: number;
};
export type Output = {
  readonly suppliedCarryPrice: number;
  readonly basisGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spotPrice: { type: "number", minimum: 0 },
    storageCost: { type: "number", minimum: 0 },
    financingCost: { type: "number", minimum: 0 },
    benefit: { type: "number", minimum: 0 },
    deliveryPrice: { type: "number" },
  },
  required: [
    "spotPrice",
    "storageCost",
    "financingCost",
    "benefit",
    "deliveryPrice",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCarryPrice: { type: "number" },
    basisGap: { type: "number" },
  },
  required: ["suppliedCarryPrice", "basisGap"],
} as const;
/** Explicit additive carry components; no market price, arbitrage trade or risk-free assumption is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spotPrice, storageCost, financingCost, benefit, deliveryPrice } =
    request;
  const compute = (): Output => {
    H.domain(
      spotPrice >= 0 && storageCost >= 0 && financingCost >= 0 && benefit >= 0,
    );
    return {
      suppliedCarryPrice: spotPrice + storageCost + financingCost - benefit,
      basisGap:
        deliveryPrice - spotPrice - storageCost - financingCost + benefit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spotPrice: 100,
    storageCost: 5,
    financingCost: 3,
    benefit: 2,
    deliveryPrice: 110,
  },
  output: { suppliedCarryPrice: 106, basisGap: 4 },
} satisfies ToolExample<Input, Output>;
export const carryPriceDeliveryBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/carry-price-delivery-basis-gap",
    title: "Carry Price Delivery Basis Gap Tool",
    description:
      "Explicit additive carry components; no market price, arbitrage trade or risk-free assumption is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spotPrice: { type: "number", minimum: 0 },
        storageCost: { type: "number", minimum: 0 },
        financingCost: { type: "number", minimum: 0 },
        benefit: { type: "number", minimum: 0 },
        deliveryPrice: { type: "number" },
      },
      required: [
        "spotPrice",
        "storageCost",
        "financingCost",
        "benefit",
        "deliveryPrice",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedCarryPrice: { type: "number" },
        basisGap: { type: "number" },
      },
      required: ["suppliedCarryPrice", "basisGap"],
    },
    ports: {
      inputs: [
        {
          id: "spotPrice",
          label: "Spot Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storageCost",
          label: "Storage Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "financingCost",
          label: "Financing Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "benefit",
          label: "Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveryPrice",
          label: "Delivery Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "suppliedCarryPrice",
          label: "Supplied Carry Price",
          valueType: { type: "number" },
        },
        { id: "basisGap", label: "Basis Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = carryPriceDeliveryBasisGapTool.execute;
export default carryPriceDeliveryBasisGapTool;
