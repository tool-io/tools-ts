import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pricePerFuelUnit: number;
  readonly heatPerFuelUnit: number;
  readonly deliveredEfficiency: number;
  readonly suppliedReferencePricePerHeat: number;
};
export type Output = {
  readonly deliveredPricePerHeat: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pricePerFuelUnit: { type: "number", minimum: 0 },
    heatPerFuelUnit: { type: "number", exclusiveMinimum: 0 },
    deliveredEfficiency: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0,
      maximum: 1,
    },
    suppliedReferencePricePerHeat: { type: "number", minimum: 0 },
  },
  required: [
    "pricePerFuelUnit",
    "heatPerFuelUnit",
    "deliveredEfficiency",
    "suppliedReferencePricePerHeat",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveredPricePerHeat: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["deliveredPricePerHeat", "referenceGap"],
} as const;
/** Calculate fuel heat price reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    pricePerFuelUnit,
    heatPerFuelUnit,
    deliveredEfficiency,
    suppliedReferencePricePerHeat,
  } = request;
  const compute = (): Output => {
    H.domain(pricePerFuelUnit >= 0 && suppliedReferencePricePerHeat >= 0);
    H.positive(heatPerFuelUnit);
    H.probability(deliveredEfficiency);
    H.positive(deliveredEfficiency);
    return (() => {
      const deliveredPricePerHeat =
        pricePerFuelUnit / heatPerFuelUnit / deliveredEfficiency;
      return {
        deliveredPricePerHeat,
        referenceGap: deliveredPricePerHeat - suppliedReferencePricePerHeat,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pricePerFuelUnit: 12,
    heatPerFuelUnit: 4,
    deliveredEfficiency: 0.5,
    suppliedReferencePricePerHeat: 5,
  },
  output: { deliveredPricePerHeat: 6, referenceGap: 1 },
} satisfies ToolExample<Input, Output>;
export const fuelHeatPriceReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/fuel-heat-price-reference-gap",
    title: "Fuel Heat Price Reference Gap Tool",
    description:
      "Calculate fuel heat price reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pricePerFuelUnit: { type: "number", minimum: 0 },
        heatPerFuelUnit: { type: "number", exclusiveMinimum: 0 },
        deliveredEfficiency: {
          type: "number",
          exclusiveMinimum: 0,
          minimum: 0,
          maximum: 1,
        },
        suppliedReferencePricePerHeat: { type: "number", minimum: 0 },
      },
      required: [
        "pricePerFuelUnit",
        "heatPerFuelUnit",
        "deliveredEfficiency",
        "suppliedReferencePricePerHeat",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveredPricePerHeat: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["deliveredPricePerHeat", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "pricePerFuelUnit",
          label: "Price Per Fuel Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heatPerFuelUnit",
          label: "Heat Per Fuel Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveredEfficiency",
          label: "Delivered Efficiency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferencePricePerHeat",
          label: "Supplied Reference Price Per Heat",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "deliveredPricePerHeat",
          label: "Delivered Price Per Heat",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fuelHeatPriceReferenceGapTool.execute;
export default fuelHeatPriceReferenceGapTool;
