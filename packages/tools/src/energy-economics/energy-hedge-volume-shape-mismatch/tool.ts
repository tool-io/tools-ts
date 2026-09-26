import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loadMwh: number;
  readonly hedgedMwh: number;
  readonly fixedPrice: number;
  readonly spotPrice: number;
};
export type Output = {
  readonly unhedgedMwh: number;
  readonly settlementCost: number;
  readonly fullyHedgedCostGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadMwh: { type: "number", minimum: 0 },
    hedgedMwh: { type: "number", minimum: 0 },
    fixedPrice: { type: "number" },
    spotPrice: { type: "number" },
  },
  required: ["loadMwh", "hedgedMwh", "fixedPrice", "spotPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unhedgedMwh: { type: "number" },
    settlementCost: { type: "number" },
    fullyHedgedCostGap: { type: "number" },
  },
  required: ["unhedgedMwh", "settlementCost", "fullyHedgedCostGap"],
} as const;
/** A physical fixed-price hedge and spot-settled residual; negative residual represents excess hedged energy sold at spot. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loadMwh, hedgedMwh, fixedPrice, spotPrice } = request;
  const compute = (): Output => {
    H.domain(loadMwh >= 0 && hedgedMwh >= 0);
    return {
      unhedgedMwh: loadMwh - hedgedMwh,
      settlementCost:
        hedgedMwh * fixedPrice + (loadMwh - hedgedMwh) * spotPrice,
      fullyHedgedCostGap: (loadMwh - hedgedMwh) * (spotPrice - fixedPrice),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loadMwh: 100, hedgedMwh: 80, fixedPrice: 50, spotPrice: 70 },
  output: { unhedgedMwh: 20, settlementCost: 5400, fullyHedgedCostGap: 400 },
} satisfies ToolExample<Input, Output>;
export const energyHedgeVolumeShapeMismatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/energy-hedge-volume-shape-mismatch",
    title: "Energy Hedge Volume Shape Mismatch Tool",
    description:
      "A physical fixed-price hedge and spot-settled residual; negative residual represents excess hedged energy sold at spot.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadMwh: { type: "number", minimum: 0 },
        hedgedMwh: { type: "number", minimum: 0 },
        fixedPrice: { type: "number" },
        spotPrice: { type: "number" },
      },
      required: ["loadMwh", "hedgedMwh", "fixedPrice", "spotPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unhedgedMwh: { type: "number" },
        settlementCost: { type: "number" },
        fullyHedgedCostGap: { type: "number" },
      },
      required: ["unhedgedMwh", "settlementCost", "fullyHedgedCostGap"],
    },
    ports: {
      inputs: [
        {
          id: "loadMwh",
          label: "Load Mwh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hedgedMwh",
          label: "Hedged Mwh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedPrice",
          label: "Fixed Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spotPrice",
          label: "Spot Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unhedgedMwh",
          label: "Unhedged Mwh",
          valueType: { type: "number" },
        },
        {
          id: "settlementCost",
          label: "Settlement Cost",
          valueType: { type: "number" },
        },
        {
          id: "fullyHedgedCostGap",
          label: "Fully Hedged Cost Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = energyHedgeVolumeShapeMismatchTool.execute;
export default energyHedgeVolumeShapeMismatchTool;
