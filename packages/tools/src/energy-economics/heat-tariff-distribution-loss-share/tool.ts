import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveredHeat: number;
  readonly lossFraction: number;
  readonly productionPrice: number;
};
export type Output = {
  readonly producedHeat: number;
  readonly losses: number;
  readonly cost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveredHeat: { type: "number", minimum: 0 },
    lossFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    productionPrice: { type: "number" },
  },
  required: ["deliveredHeat", "lossFraction", "productionPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    producedHeat: { type: "number" },
    losses: { type: "number" },
    cost: { type: "number" },
  },
  required: ["producedHeat", "losses", "cost"],
} as const;
/** Calculate heat tariff distribution loss share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveredHeat, lossFraction, productionPrice } = request;
  const compute = (): Output => {
    H.domain(deliveredHeat >= 0 && lossFraction >= 0 && lossFraction < 1);
    return {
      producedHeat: deliveredHeat / (1 - lossFraction),
      losses: (deliveredHeat * lossFraction) / (1 - lossFraction),
      cost: (deliveredHeat * productionPrice) / (1 - lossFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deliveredHeat: 80, lossFraction: 0.2, productionPrice: 50 },
  output: { producedHeat: 100, losses: 20, cost: 5000 },
} satisfies ToolExample<Input, Output>;
export const heatTariffDistributionLossShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/heat-tariff-distribution-loss-share",
    title: "Heat Tariff Distribution Loss Share Tool",
    description:
      "Calculate heat tariff distribution loss share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveredHeat: { type: "number", minimum: 0 },
        lossFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        productionPrice: { type: "number" },
      },
      required: ["deliveredHeat", "lossFraction", "productionPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        producedHeat: { type: "number" },
        losses: { type: "number" },
        cost: { type: "number" },
      },
      required: ["producedHeat", "losses", "cost"],
    },
    ports: {
      inputs: [
        {
          id: "deliveredHeat",
          label: "Delivered Heat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "productionPrice",
          label: "Production Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "producedHeat",
          label: "Produced Heat",
          valueType: { type: "number" },
        },
        { id: "losses", label: "Losses", valueType: { type: "number" } },
        { id: "cost", label: "Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = heatTariffDistributionLossShareTool.execute;
export default heatTariffDistributionLossShareTool;
