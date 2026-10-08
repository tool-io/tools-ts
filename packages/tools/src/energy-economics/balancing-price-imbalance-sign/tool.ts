import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualEnergy: number;
  readonly scheduledEnergy: number;
  readonly settlementPrice: number;
};
export type Output = {
  readonly imbalanceEnergy: number;
  readonly signedSettlement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualEnergy: { type: "number" },
    scheduledEnergy: { type: "number" },
    settlementPrice: { type: "number" },
  },
  required: ["actualEnergy", "scheduledEnergy", "settlementPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imbalanceEnergy: { type: "number" },
    signedSettlement: { type: "number" },
  },
  required: ["imbalanceEnergy", "signedSettlement"],
} as const;
/** Apply an explicit price to actual-minus-scheduled energy imbalance under a supplied surplus-positive convention without market settlement rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualEnergy, scheduledEnergy, settlementPrice } = request;
  const compute = (): Output => {
    return {
      imbalanceEnergy: actualEnergy - scheduledEnergy,
      signedSettlement: (actualEnergy - scheduledEnergy) * settlementPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualEnergy: 12, scheduledEnergy: 10, settlementPrice: 20 },
  output: { imbalanceEnergy: 2, signedSettlement: 40 },
} satisfies ToolExample<Input, Output>;
export const balancingPriceImbalanceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/balancing-price-imbalance-sign",
    title: "Balancing Price Imbalance Sign Tool",
    description:
      "Apply an explicit price to actual-minus-scheduled energy imbalance under a supplied surplus-positive convention without market settlement rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualEnergy: { type: "number" },
        scheduledEnergy: { type: "number" },
        settlementPrice: { type: "number" },
      },
      required: ["actualEnergy", "scheduledEnergy", "settlementPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imbalanceEnergy: { type: "number" },
        signedSettlement: { type: "number" },
      },
      required: ["imbalanceEnergy", "signedSettlement"],
    },
    ports: {
      inputs: [
        {
          id: "actualEnergy",
          label: "Actual Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduledEnergy",
          label: "Scheduled Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "settlementPrice",
          label: "Settlement Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "imbalanceEnergy",
          label: "Imbalance Energy",
          valueType: { type: "number" },
        },
        {
          id: "signedSettlement",
          label: "Signed Settlement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = balancingPriceImbalanceSignTool.execute;
export default balancingPriceImbalanceSignTool;
