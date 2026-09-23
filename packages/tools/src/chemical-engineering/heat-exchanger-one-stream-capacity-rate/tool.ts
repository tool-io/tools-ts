import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massFlow: number;
  readonly specificHeat: number;
  readonly inletTemperature: number;
  readonly outletTemperature: number;
};
export type Output = {
  readonly capacityRate: number;
  readonly heatRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massFlow: { type: "number", minimum: 0 },
    specificHeat: { type: "number", minimum: 0 },
    inletTemperature: { type: "number" },
    outletTemperature: { type: "number" },
  },
  required: [
    "massFlow",
    "specificHeat",
    "inletTemperature",
    "outletTemperature",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacityRate: { type: "number" },
    heatRate: { type: "number" },
  },
  required: ["capacityRate", "heatRate"],
} as const;
/** Constant-specific-heat single-stream balance with heat positive into the stream; no phase change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massFlow, specificHeat, inletTemperature, outletTemperature } =
    request;
  const compute = (): Output => {
    H.domain(massFlow >= 0 && specificHeat >= 0);
    return {
      capacityRate: massFlow * specificHeat,
      heatRate:
        massFlow * specificHeat * (outletTemperature - inletTemperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    massFlow: 2,
    specificHeat: 4,
    inletTemperature: 20,
    outletTemperature: 50,
  },
  output: { capacityRate: 8, heatRate: 240 },
} satisfies ToolExample<Input, Output>;
export const heatExchangerOneStreamCapacityRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/heat-exchanger-one-stream-capacity-rate",
    title: "Heat Exchanger One Stream Capacity Rate Tool",
    description:
      "Constant-specific-heat single-stream balance with heat positive into the stream; no phase change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massFlow: { type: "number", minimum: 0 },
        specificHeat: { type: "number", minimum: 0 },
        inletTemperature: { type: "number" },
        outletTemperature: { type: "number" },
      },
      required: [
        "massFlow",
        "specificHeat",
        "inletTemperature",
        "outletTemperature",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacityRate: { type: "number" },
        heatRate: { type: "number" },
      },
      required: ["capacityRate", "heatRate"],
    },
    ports: {
      inputs: [
        {
          id: "massFlow",
          label: "Mass Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "specificHeat",
          label: "Specific Heat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inletTemperature",
          label: "Inlet Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletTemperature",
          label: "Outlet Temperature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "capacityRate",
          label: "Capacity Rate",
          valueType: { type: "number" },
        },
        { id: "heatRate", label: "Heat Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = heatExchangerOneStreamCapacityRateTool.execute;
export default heatExchangerOneStreamCapacityRateTool;
