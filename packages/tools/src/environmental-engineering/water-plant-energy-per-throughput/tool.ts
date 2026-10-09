import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energyKilowattHours: number;
  readonly processedCubicMeters: number;
};
export type Output = { readonly kilowattHoursPerCubicMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyKilowattHours: { type: "number", minimum: 0 },
    processedCubicMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["energyKilowattHours", "processedCubicMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kilowattHoursPerCubicMeter: { type: "number" } },
  required: ["kilowattHoursPerCubicMeter"],
} as const;
/** Normalize measured plant energy by a supplied positive water-throughput volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energyKilowattHours, processedCubicMeters } = request;
  const compute = (): Output => {
    H.domain(energyKilowattHours >= 0, "energyKilowattHours");
    (H.domain(processedCubicMeters > 0, "processedCubicMeters"),
      processedCubicMeters);
    return {
      kilowattHoursPerCubicMeter: energyKilowattHours / processedCubicMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { energyKilowattHours: 1200, processedCubicMeters: 3000 },
  output: { kilowattHoursPerCubicMeter: 0.4 },
} satisfies ToolExample<Input, Output>;
export const waterPlantEnergyPerThroughputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-engineering",
        "environmental engineering",
        "engineering",
      ],
      keywords: ["environmental engineering", "engineering"],
    },
    id: "environmental-engineering/water-plant-energy-per-throughput",
    title: "Water Plant Energy Per Throughput",
    description:
      "Normalize measured plant energy by a supplied positive water-throughput volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyKilowattHours: { type: "number", minimum: 0 },
        processedCubicMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["energyKilowattHours", "processedCubicMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kilowattHoursPerCubicMeter: { type: "number" } },
      required: ["kilowattHoursPerCubicMeter"],
    },
    ports: {
      inputs: [
        {
          id: "energyKilowattHours",
          label: "Energy Kilowatt Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processedCubicMeters",
          label: "Processed Cubic Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "kilowattHoursPerCubicMeter",
          label: "Kilowatt Hours Per Cubic Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterPlantEnergyPerThroughputTool.execute;
export default waterPlantEnergyPerThroughputTool;
