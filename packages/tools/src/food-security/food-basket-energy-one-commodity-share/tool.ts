import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commodityMass: number;
  readonly energyPerMass: number;
  readonly otherEnergy: number;
};
export type Output = {
  readonly commodityEnergy: number;
  readonly energyShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commodityMass: { type: "number", minimum: 0 },
    energyPerMass: { type: "number", minimum: 0 },
    otherEnergy: { type: "number", minimum: 0 },
  },
  required: ["commodityMass", "energyPerMass", "otherEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commodityEnergy: { type: "number" },
    energyShare: { type: "number" },
  },
  required: ["commodityEnergy", "energyShare"],
} as const;
/** Calculate food basket energy one commodity share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commodityMass, energyPerMass, otherEnergy } = request;
  const compute = (): Output => {
    H.domain(
      commodityMass >= 0 &&
        energyPerMass >= 0 &&
        otherEnergy >= 0 &&
        commodityMass * energyPerMass + otherEnergy > 0,
    );
    return {
      commodityEnergy: commodityMass * energyPerMass,
      energyShare:
        (commodityMass * energyPerMass) /
        (commodityMass * energyPerMass + otherEnergy),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commodityMass: 2, energyPerMass: 1000, otherEnergy: 3000 },
  output: { commodityEnergy: 2000, energyShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const foodBasketEnergyOneCommodityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-basket-energy-one-commodity-share",
    title: "Food Basket Energy One Commodity Share Tool",
    description:
      "Calculate food basket energy one commodity share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commodityMass: { type: "number", minimum: 0 },
        energyPerMass: { type: "number", minimum: 0 },
        otherEnergy: { type: "number", minimum: 0 },
      },
      required: ["commodityMass", "energyPerMass", "otherEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commodityEnergy: { type: "number" },
        energyShare: { type: "number" },
      },
      required: ["commodityEnergy", "energyShare"],
    },
    ports: {
      inputs: [
        {
          id: "commodityMass",
          label: "Commodity Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energyPerMass",
          label: "Energy Per Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherEnergy",
          label: "Other Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "commodityEnergy",
          label: "Commodity Energy",
          valueType: { type: "number" },
        },
        {
          id: "energyShare",
          label: "Energy Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodBasketEnergyOneCommodityShareTool.execute;
export default foodBasketEnergyOneCommodityShareTool;
