import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packPrice: number;
  readonly packQuantity: number;
  readonly usableFraction: number;
  readonly requiredQuantity: number;
};
export type Output = {
  readonly usablePerPack: number;
  readonly unitCost: number;
  readonly packs: number;
  readonly purchaseCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packPrice: { type: "number", minimum: 0 },
    packQuantity: { type: "number", exclusiveMinimum: 0 },
    usableFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    requiredQuantity: { type: "number", minimum: 0 },
  },
  required: ["packPrice", "packQuantity", "usableFraction", "requiredQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usablePerPack: { type: "number" },
    unitCost: { type: "number" },
    packs: { type: "integer" },
    purchaseCost: { type: "number" },
  },
  required: ["usablePerPack", "unitCost", "packs", "purchaseCost"],
} as const;
/** Calculate agricultural input pack size unit cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packPrice, packQuantity, usableFraction, requiredQuantity } = request;
  const compute = (): Output => {
    H.domain(
      packPrice >= 0 &&
        requiredQuantity >= 0 &&
        usableFraction > 0 &&
        usableFraction <= 1,
    );
    H.positive(packQuantity);
    return {
      usablePerPack: packQuantity * usableFraction,
      unitCost: packPrice / (packQuantity * usableFraction),
      packs: Math.ceil(requiredQuantity / (packQuantity * usableFraction)),
      purchaseCost:
        Math.ceil(requiredQuantity / (packQuantity * usableFraction)) *
        packPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packPrice: 40,
    packQuantity: 10,
    usableFraction: 0.8,
    requiredQuantity: 20,
  },
  output: { usablePerPack: 8, unitCost: 5, packs: 3, purchaseCost: 120 },
} satisfies ToolExample<Input, Output>;
export const agriculturalInputPackSizeUnitCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/agricultural-input-pack-size-unit-cost",
    title: "Agricultural Input Pack Size Unit Cost Tool",
    description:
      "Calculate agricultural input pack size unit cost from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packPrice: { type: "number", minimum: 0 },
        packQuantity: { type: "number", exclusiveMinimum: 0 },
        usableFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        requiredQuantity: { type: "number", minimum: 0 },
      },
      required: [
        "packPrice",
        "packQuantity",
        "usableFraction",
        "requiredQuantity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usablePerPack: { type: "number" },
        unitCost: { type: "number" },
        packs: { type: "integer" },
        purchaseCost: { type: "number" },
      },
      required: ["usablePerPack", "unitCost", "packs", "purchaseCost"],
    },
    ports: {
      inputs: [
        {
          id: "packPrice",
          label: "Pack Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "packQuantity",
          label: "Pack Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usableFraction",
          label: "Usable Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredQuantity",
          label: "Required Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usablePerPack",
          label: "Usable Per Pack",
          valueType: { type: "number" },
        },
        { id: "unitCost", label: "Unit Cost", valueType: { type: "number" } },
        { id: "packs", label: "Packs", valueType: { type: "integer" } },
        {
          id: "purchaseCost",
          label: "Purchase Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agriculturalInputPackSizeUnitCostTool.execute;
export default agriculturalInputPackSizeUnitCostTool;
