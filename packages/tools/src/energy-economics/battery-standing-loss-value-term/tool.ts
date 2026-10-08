import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storedEnergy: number;
  readonly suppliedLossFraction: number;
  readonly energyPrice: number;
};
export type Output = {
  readonly lostEnergy: number;
  readonly signedLossValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storedEnergy: { type: "number", minimum: 0 },
    suppliedLossFraction: { type: "number", minimum: 0, maximum: 1 },
    energyPrice: { type: "number" },
  },
  required: ["storedEnergy", "suppliedLossFraction", "energyPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostEnergy: { type: "number" },
    signedLossValue: { type: "number" },
  },
  required: ["lostEnergy", "signedLossValue"],
} as const;
/** Value one supplied standing-loss energy fraction at an explicit signed price without estimating battery self-discharge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storedEnergy, suppliedLossFraction, energyPrice } = request;
  const compute = (): Output => {
    H.domain(storedEnergy >= 0, "storedEnergy");
    (H.domain(
      suppliedLossFraction >= 0 && suppliedLossFraction <= 1,
      "suppliedLossFraction",
    ),
      suppliedLossFraction);
    return {
      lostEnergy: storedEnergy * suppliedLossFraction,
      signedLossValue: storedEnergy * suppliedLossFraction * energyPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storedEnergy: 100, suppliedLossFraction: 0.02, energyPrice: 50 },
  output: { lostEnergy: 2, signedLossValue: 100 },
} satisfies ToolExample<Input, Output>;
export const batteryStandingLossValueTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/battery-standing-loss-value-term",
    title: "Battery Standing Loss Value Term Tool",
    description:
      "Value one supplied standing-loss energy fraction at an explicit signed price without estimating battery self-discharge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storedEnergy: { type: "number", minimum: 0 },
        suppliedLossFraction: { type: "number", minimum: 0, maximum: 1 },
        energyPrice: { type: "number" },
      },
      required: ["storedEnergy", "suppliedLossFraction", "energyPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostEnergy: { type: "number" },
        signedLossValue: { type: "number" },
      },
      required: ["lostEnergy", "signedLossValue"],
    },
    ports: {
      inputs: [
        {
          id: "storedEnergy",
          label: "Stored Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLossFraction",
          label: "Supplied Loss Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energyPrice",
          label: "Energy Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lostEnergy",
          label: "Lost Energy",
          valueType: { type: "number" },
        },
        {
          id: "signedLossValue",
          label: "Signed Loss Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = batteryStandingLossValueTermTool.execute;
export default batteryStandingLossValueTermTool;
