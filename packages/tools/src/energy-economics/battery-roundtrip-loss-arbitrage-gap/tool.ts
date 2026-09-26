import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveredMwh: number;
  readonly buyPrice: number;
  readonly sellPrice: number;
  readonly roundtripEfficiency: number;
};
export type Output = {
  readonly purchasedMwh: number;
  readonly grossMargin: number;
  readonly breakEvenSellPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveredMwh: { type: "number", minimum: 0 },
    buyPrice: { type: "number" },
    sellPrice: { type: "number" },
    roundtripEfficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["deliveredMwh", "buyPrice", "sellPrice", "roundtripEfficiency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchasedMwh: { type: "number" },
    grossMargin: { type: "number" },
    breakEvenSellPrice: { type: "number" },
  },
  required: ["purchasedMwh", "grossMargin", "breakEvenSellPrice"],
} as const;
/** Calculate battery roundtrip loss arbitrage gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveredMwh, buyPrice, sellPrice, roundtripEfficiency } = request;
  const compute = (): Output => {
    H.domain(
      deliveredMwh >= 0 && roundtripEfficiency > 0 && roundtripEfficiency <= 1,
    );
    return {
      purchasedMwh: deliveredMwh / roundtripEfficiency,
      grossMargin:
        deliveredMwh * sellPrice -
        (deliveredMwh * buyPrice) / roundtripEfficiency,
      breakEvenSellPrice: buyPrice / roundtripEfficiency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deliveredMwh: 8,
    buyPrice: 50,
    sellPrice: 100,
    roundtripEfficiency: 0.8,
  },
  output: { purchasedMwh: 10, grossMargin: 300, breakEvenSellPrice: 62.5 },
} satisfies ToolExample<Input, Output>;
export const batteryRoundtripLossArbitrageGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/battery-roundtrip-loss-arbitrage-gap",
    title: "Battery Roundtrip Loss Arbitrage Gap Tool",
    description:
      "Calculate battery roundtrip loss arbitrage gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveredMwh: { type: "number", minimum: 0 },
        buyPrice: { type: "number" },
        sellPrice: { type: "number" },
        roundtripEfficiency: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: [
        "deliveredMwh",
        "buyPrice",
        "sellPrice",
        "roundtripEfficiency",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchasedMwh: { type: "number" },
        grossMargin: { type: "number" },
        breakEvenSellPrice: { type: "number" },
      },
      required: ["purchasedMwh", "grossMargin", "breakEvenSellPrice"],
    },
    ports: {
      inputs: [
        {
          id: "deliveredMwh",
          label: "Delivered Mwh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "buyPrice",
          label: "Buy Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sellPrice",
          label: "Sell Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roundtripEfficiency",
          label: "Roundtrip Efficiency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "purchasedMwh",
          label: "Purchased Mwh",
          valueType: { type: "number" },
        },
        {
          id: "grossMargin",
          label: "Gross Margin",
          valueType: { type: "number" },
        },
        {
          id: "breakEvenSellPrice",
          label: "Break Even Sell Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = batteryRoundtripLossArbitrageGapTool.execute;
export default batteryRoundtripLossArbitrageGapTool;
