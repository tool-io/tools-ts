import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly milkMass: number;
  readonly componentFraction: number;
  readonly suppliedPrice: number;
  readonly pricePerComponentMass: boolean;
};
export type Output = { readonly pricingMass: number; readonly revenue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    milkMass: { type: "number", minimum: 0 },
    componentFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedPrice: { type: "number", minimum: 0 },
    pricePerComponentMass: { type: "boolean" },
  },
  required: [
    "milkMass",
    "componentFraction",
    "suppliedPrice",
    "pricePerComponentMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pricingMass: { type: "number" }, revenue: { type: "number" } },
  required: ["pricingMass", "revenue"],
} as const;
/** Calculate milk component price base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { milkMass, componentFraction, suppliedPrice, pricePerComponentMass } =
    request;
  const compute = (): Output => {
    H.domain(milkMass >= 0 && suppliedPrice >= 0);
    H.probability(componentFraction);
    return {
      pricingMass: milkMass * (pricePerComponentMass ? componentFraction : 1),
      revenue:
        milkMass *
        (pricePerComponentMass ? componentFraction : 1) *
        suppliedPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    milkMass: 100,
    componentFraction: 0.04,
    suppliedPrice: 5,
    pricePerComponentMass: true,
  },
  output: { pricingMass: 4, revenue: 20 },
} satisfies ToolExample<Input, Output>;
export const milkComponentPriceBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/milk-component-price-base-flag",
    title: "Milk Component Price Base Flag Tool",
    description:
      "Calculate milk component price base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        milkMass: { type: "number", minimum: 0 },
        componentFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedPrice: { type: "number", minimum: 0 },
        pricePerComponentMass: { type: "boolean" },
      },
      required: [
        "milkMass",
        "componentFraction",
        "suppliedPrice",
        "pricePerComponentMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pricingMass: { type: "number" },
        revenue: { type: "number" },
      },
      required: ["pricingMass", "revenue"],
    },
    ports: {
      inputs: [
        {
          id: "milkMass",
          label: "Milk Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "componentFraction",
          label: "Component Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "suppliedPrice",
          label: "Supplied Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerComponentMass",
          label: "Price Per Component Mass",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "pricingMass",
          label: "Pricing Mass",
          valueType: { type: "number" },
        },
        { id: "revenue", label: "Revenue", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = milkComponentPriceBaseFlagTool.execute;
export default milkComponentPriceBaseFlagTool;
