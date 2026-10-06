import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumetricHeatCapacity: number;
  readonly layerThicknessMeters: number;
  readonly temperatureChangeKelvin: number;
};
export type Output = { readonly energyChangeJoulesPerSquareMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumetricHeatCapacity: { type: "number", minimum: 0 },
    layerThicknessMeters: { type: "number", minimum: 0 },
    temperatureChangeKelvin: { type: "number" },
  },
  required: [
    "volumetricHeatCapacity",
    "layerThicknessMeters",
    "temperatureChangeKelvin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyChangeJoulesPerSquareMeter: { type: "number" } },
  required: ["energyChangeJoulesPerSquareMeter"],
} as const;
/** Multiply explicit layer volumetric heat capacity, thickness, and temperature change under a uniform-layer assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    volumetricHeatCapacity,
    layerThicknessMeters,
    temperatureChangeKelvin,
  } = request;
  const compute = (): Output => {
    H.domain(
      volumetricHeatCapacity >= 0 && layerThicknessMeters >= 0,
      "volumetricHeatCapacity",
    );
    return {
      energyChangeJoulesPerSquareMeter:
        volumetricHeatCapacity * layerThicknessMeters * temperatureChangeKelvin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volumetricHeatCapacity: 2000000,
    layerThicknessMeters: 0.1,
    temperatureChangeKelvin: 2,
  },
  output: { energyChangeJoulesPerSquareMeter: 400000 },
} satisfies ToolExample<Input, Output>;
export const soilHeatLayerStorageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrophysics", "agriculture"],
      keywords: ["agrophysics", "agriculture"],
    },
    id: "agrophysics/soil-heat-layer-storage-term",
    title: "Soil Heat Layer Storage Term",
    description:
      "Multiply explicit layer volumetric heat capacity, thickness, and temperature change under a uniform-layer assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumetricHeatCapacity: { type: "number", minimum: 0 },
        layerThicknessMeters: { type: "number", minimum: 0 },
        temperatureChangeKelvin: { type: "number" },
      },
      required: [
        "volumetricHeatCapacity",
        "layerThicknessMeters",
        "temperatureChangeKelvin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { energyChangeJoulesPerSquareMeter: { type: "number" } },
      required: ["energyChangeJoulesPerSquareMeter"],
    },
    ports: {
      inputs: [
        {
          id: "volumetricHeatCapacity",
          label: "Volumetric Heat Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layerThicknessMeters",
          label: "Layer Thickness Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureChangeKelvin",
          label: "Temperature Change Kelvin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyChangeJoulesPerSquareMeter",
          label: "Energy Change Joules Per Square Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilHeatLayerStorageTermTool.execute;
export default soilHeatLayerStorageTermTool;
