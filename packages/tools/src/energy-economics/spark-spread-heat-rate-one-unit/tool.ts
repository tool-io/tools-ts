import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly powerPrice: number;
  readonly gasPricePerFuelUnit: number;
  readonly heatRate: number;
  readonly variableCost: number;
};
export type Output = {
  readonly fuelCost: number;
  readonly sparkSpread: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powerPrice: { type: "number" },
    gasPricePerFuelUnit: { type: "number" },
    heatRate: { type: "number", minimum: 0 },
    variableCost: { type: "number" },
  },
  required: ["powerPrice", "gasPricePerFuelUnit", "heatRate", "variableCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fuelCost: { type: "number" }, sparkSpread: { type: "number" } },
  required: ["fuelCost", "sparkSpread"],
} as const;
/** Electricity price less fuel and variable costs with caller-aligned fuel units and heat rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { powerPrice, gasPricePerFuelUnit, heatRate, variableCost } = request;
  const compute = (): Output => {
    H.domain(heatRate >= 0);
    return {
      fuelCost: gasPricePerFuelUnit * heatRate,
      sparkSpread: powerPrice - gasPricePerFuelUnit * heatRate - variableCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    powerPrice: 100,
    gasPricePerFuelUnit: 10,
    heatRate: 7,
    variableCost: 5,
  },
  output: { fuelCost: 70, sparkSpread: 25 },
} satisfies ToolExample<Input, Output>;
export const sparkSpreadHeatRateOneUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/spark-spread-heat-rate-one-unit",
    title: "Spark Spread Heat Rate One Unit Tool",
    description:
      "Electricity price less fuel and variable costs with caller-aligned fuel units and heat rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        powerPrice: { type: "number" },
        gasPricePerFuelUnit: { type: "number" },
        heatRate: { type: "number", minimum: 0 },
        variableCost: { type: "number" },
      },
      required: [
        "powerPrice",
        "gasPricePerFuelUnit",
        "heatRate",
        "variableCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fuelCost: { type: "number" },
        sparkSpread: { type: "number" },
      },
      required: ["fuelCost", "sparkSpread"],
    },
    ports: {
      inputs: [
        {
          id: "powerPrice",
          label: "Power Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasPricePerFuelUnit",
          label: "Gas Price Per Fuel Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heatRate",
          label: "Heat Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "variableCost",
          label: "Variable Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fuelCost", label: "Fuel Cost", valueType: { type: "number" } },
        {
          id: "sparkSpread",
          label: "Spark Spread",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sparkSpreadHeatRateOneUnitTool.execute;
export default sparkSpreadHeatRateOneUnitTool;
