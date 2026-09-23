import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heatCapacity: number;
  readonly measuredTemperature: number;
  readonly referenceTemperature: number;
  readonly mass: number;
};
export type Output = {
  readonly temperatureGap: number;
  readonly sensibleEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heatCapacity: { type: "number", minimum: 0 },
    measuredTemperature: { type: "number" },
    referenceTemperature: { type: "number" },
    mass: { type: "number", minimum: 0 },
  },
  required: [
    "heatCapacity",
    "measuredTemperature",
    "referenceTemperature",
    "mass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureGap: { type: "number" },
    sensibleEnergy: { type: "number" },
  },
  required: ["temperatureGap", "sensibleEnergy"],
} as const;
/** Constant supplied heat-capacity sensible-energy difference in consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heatCapacity, measuredTemperature, referenceTemperature, mass } =
    request;
  const compute = (): Output => {
    H.domain(heatCapacity >= 0 && mass >= 0);
    return {
      temperatureGap: measuredTemperature - referenceTemperature,
      sensibleEnergy:
        mass * heatCapacity * (measuredTemperature - referenceTemperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    heatCapacity: 4,
    measuredTemperature: 30,
    referenceTemperature: 20,
    mass: 2,
  },
  output: { temperatureGap: 10, sensibleEnergy: 80 },
} satisfies ToolExample<Input, Output>;
export const heatCapacityReferenceTemperatureGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/heat-capacity-reference-temperature-gap",
      title: "Heat Capacity Reference Temperature Gap Tool",
      description:
        "Constant supplied heat-capacity sensible-energy difference in consistent units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          heatCapacity: { type: "number", minimum: 0 },
          measuredTemperature: { type: "number" },
          referenceTemperature: { type: "number" },
          mass: { type: "number", minimum: 0 },
        },
        required: [
          "heatCapacity",
          "measuredTemperature",
          "referenceTemperature",
          "mass",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperatureGap: { type: "number" },
          sensibleEnergy: { type: "number" },
        },
        required: ["temperatureGap", "sensibleEnergy"],
      },
      ports: {
        inputs: [
          {
            id: "heatCapacity",
            label: "Heat Capacity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredTemperature",
            label: "Measured Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTemperature",
            label: "Reference Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "temperatureGap",
            label: "Temperature Gap",
            valueType: { type: "number" },
          },
          {
            id: "sensibleEnergy",
            label: "Sensible Energy",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = heatCapacityReferenceTemperatureGapTool.execute;
export default heatCapacityReferenceTemperatureGapTool;
