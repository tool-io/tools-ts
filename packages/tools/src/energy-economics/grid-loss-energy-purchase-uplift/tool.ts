import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveredEnergy: number;
  readonly lossFraction: number;
};
export type Output = {
  readonly requiredPurchasedEnergy: number;
  readonly lossEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveredEnergy: { type: "number", minimum: 0 },
    lossFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["deliveredEnergy", "lossFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredPurchasedEnergy: { type: "number" },
    lossEnergy: { type: "number" },
  },
  required: ["requiredPurchasedEnergy", "lossEnergy"],
} as const;
/** Calculate purchased energy required for supplied delivered energy when losses are an explicit fraction of purchased energy below one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveredEnergy, lossFraction } = request;
  const compute = (): Output => {
    H.domain(deliveredEnergy >= 0, "deliveredEnergy");
    H.domain(lossFraction >= 0 && lossFraction < 1, "lossFraction");
    return (() => {
      const requiredPurchasedEnergy = deliveredEnergy / (1 - lossFraction);
      return {
        requiredPurchasedEnergy,
        lossEnergy: requiredPurchasedEnergy - deliveredEnergy,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deliveredEnergy: 90, lossFraction: 0.1 },
  output: { requiredPurchasedEnergy: 100, lossEnergy: 10 },
} satisfies ToolExample<Input, Output>;
export const gridLossEnergyPurchaseUpliftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/grid-loss-energy-purchase-uplift",
    title: "Grid Loss Energy Purchase Uplift Tool",
    description:
      "Calculate purchased energy required for supplied delivered energy when losses are an explicit fraction of purchased energy below one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveredEnergy: { type: "number", minimum: 0 },
        lossFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["deliveredEnergy", "lossFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredPurchasedEnergy: { type: "number" },
        lossEnergy: { type: "number" },
      },
      required: ["requiredPurchasedEnergy", "lossEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "deliveredEnergy",
          label: "Delivered Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredPurchasedEnergy",
          label: "Required Purchased Energy",
          valueType: { type: "number" },
        },
        {
          id: "lossEnergy",
          label: "Loss Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gridLossEnergyPurchaseUpliftTool.execute;
export default gridLossEnergyPurchaseUpliftTool;
