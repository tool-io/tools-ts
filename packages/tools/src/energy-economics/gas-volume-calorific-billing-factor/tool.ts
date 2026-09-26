import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meteredVolume: number;
  readonly correctionFactor: number;
  readonly calorificMjPerVolume: number;
  readonly pricePerKwh: number;
};
export type Output = {
  readonly correctedVolume: number;
  readonly kwh: number;
  readonly cost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meteredVolume: { type: "number", minimum: 0 },
    correctionFactor: { type: "number", exclusiveMinimum: 0 },
    calorificMjPerVolume: { type: "number", exclusiveMinimum: 0 },
    pricePerKwh: { type: "number" },
  },
  required: [
    "meteredVolume",
    "correctionFactor",
    "calorificMjPerVolume",
    "pricePerKwh",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedVolume: { type: "number" },
    kwh: { type: "number" },
    cost: { type: "number" },
  },
  required: ["correctedVolume", "kwh", "cost"],
} as const;
/** MJ converted to kWh using 3.6 MJ/kWh; the caller supplies pressure/temperature correction and calorific basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meteredVolume, correctionFactor, calorificMjPerVolume, pricePerKwh } =
    request;
  const compute = (): Output => {
    H.domain(meteredVolume >= 0);
    H.positive(correctionFactor);
    H.positive(calorificMjPerVolume);
    const correctedVolume = meteredVolume * correctionFactor,
      kwh = (correctedVolume * calorificMjPerVolume) / 3.6;
    return { correctedVolume, kwh, cost: kwh * pricePerKwh };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    meteredVolume: 100,
    correctionFactor: 1.02,
    calorificMjPerVolume: 36,
    pricePerKwh: 0.1,
  },
  output: { correctedVolume: 102, kwh: 1020, cost: 102 },
} satisfies ToolExample<Input, Output>;
export const gasVolumeCalorificBillingFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/gas-volume-calorific-billing-factor",
    title: "Gas Volume Calorific Billing Factor Tool",
    description:
      "MJ converted to kWh using 3.6 MJ/kWh; the caller supplies pressure/temperature correction and calorific basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meteredVolume: { type: "number", minimum: 0 },
        correctionFactor: { type: "number", exclusiveMinimum: 0 },
        calorificMjPerVolume: { type: "number", exclusiveMinimum: 0 },
        pricePerKwh: { type: "number" },
      },
      required: [
        "meteredVolume",
        "correctionFactor",
        "calorificMjPerVolume",
        "pricePerKwh",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedVolume: { type: "number" },
        kwh: { type: "number" },
        cost: { type: "number" },
      },
      required: ["correctedVolume", "kwh", "cost"],
    },
    ports: {
      inputs: [
        {
          id: "meteredVolume",
          label: "Metered Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correctionFactor",
          label: "Correction Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calorificMjPerVolume",
          label: "Calorific Mj Per Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerKwh",
          label: "Price Per Kwh",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedVolume",
          label: "Corrected Volume",
          valueType: { type: "number" },
        },
        { id: "kwh", label: "Kwh", valueType: { type: "number" } },
        { id: "cost", label: "Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gasVolumeCalorificBillingFactorTool.execute;
export default gasVolumeCalorificBillingFactorTool;
