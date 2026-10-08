import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialPrice: number;
  readonly initialQuantity: number;
  readonly priceMultiplier: number;
};
export type Output = {
  readonly newPrice: number;
  readonly revenueNeutralQuantity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialPrice: { type: "number", minimum: 0 },
    initialQuantity: { type: "number", minimum: 0 },
    priceMultiplier: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["initialPrice", "initialQuantity", "priceMultiplier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newPrice: { type: "number" },
    revenueNeutralQuantity: { type: "number" },
  },
  required: ["newPrice", "revenueNeutralQuantity"],
} as const;
/** Apply an explicit price multiplier and reciprocal quantity multiplier to preserve revenue, without asserting empirical demand elasticity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialPrice, initialQuantity, priceMultiplier } = request;
  const compute = (): Output => {
    H.domain(initialPrice >= 0 && initialQuantity >= 0, "initialPrice");
    (H.domain(
      Number.isFinite(priceMultiplier) && priceMultiplier > 0,
      "priceMultiplier",
    ),
      priceMultiplier);
    return {
      newPrice: initialPrice * priceMultiplier,
      revenueNeutralQuantity: initialQuantity / priceMultiplier,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialPrice: 10, initialQuantity: 100, priceMultiplier: 1.25 },
  output: { newPrice: 12.5, revenueNeutralQuantity: 80 },
} satisfies ToolExample<Input, Output>;
export const unitElasticityRevenueNeutralStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economics"],
      keywords: ["economics"],
    },
    id: "economics/unit-elasticity-revenue-neutral-step",
    title: "Unit Elasticity Revenue Neutral Step",
    description:
      "Apply an explicit price multiplier and reciprocal quantity multiplier to preserve revenue, without asserting empirical demand elasticity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialPrice: { type: "number", minimum: 0 },
        initialQuantity: { type: "number", minimum: 0 },
        priceMultiplier: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["initialPrice", "initialQuantity", "priceMultiplier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newPrice: { type: "number" },
        revenueNeutralQuantity: { type: "number" },
      },
      required: ["newPrice", "revenueNeutralQuantity"],
    },
    ports: {
      inputs: [
        {
          id: "initialPrice",
          label: "Initial Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialQuantity",
          label: "Initial Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceMultiplier",
          label: "Price Multiplier",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "newPrice", label: "New Price", valueType: { type: "number" } },
        {
          id: "revenueNeutralQuantity",
          label: "Revenue Neutral Quantity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = unitElasticityRevenueNeutralStepTool.execute;
export default unitElasticityRevenueNeutralStepTool;
