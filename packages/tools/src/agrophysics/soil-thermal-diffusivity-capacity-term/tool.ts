import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conductivity: number;
  readonly dryBulkDensity: number;
  readonly massHeatCapacity: number;
  readonly waterVolumeFraction: number;
  readonly waterVolumeHeatCapacity: number;
};
export type Output = {
  readonly volumeHeatCapacity: number;
  readonly diffusivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductivity: { type: "number", minimum: 0 },
    dryBulkDensity: { type: "number", minimum: 0 },
    massHeatCapacity: { type: "number", minimum: 0 },
    waterVolumeFraction: { type: "number", minimum: 0 },
    waterVolumeHeatCapacity: { type: "number", minimum: 0 },
  },
  required: [
    "conductivity",
    "dryBulkDensity",
    "massHeatCapacity",
    "waterVolumeFraction",
    "waterVolumeHeatCapacity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeHeatCapacity: { type: "number" },
    diffusivity: { type: "number" },
  },
  required: ["volumeHeatCapacity", "diffusivity"],
} as const;
/** Calculate soil thermal diffusivity capacity term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    conductivity,
    dryBulkDensity,
    massHeatCapacity,
    waterVolumeFraction,
    waterVolumeHeatCapacity,
  } = request;
  const compute = (): Output => {
    H.domain(
      conductivity >= 0 &&
        dryBulkDensity >= 0 &&
        massHeatCapacity >= 0 &&
        waterVolumeFraction >= 0 &&
        waterVolumeHeatCapacity >= 0 &&
        dryBulkDensity * massHeatCapacity +
          waterVolumeFraction * waterVolumeHeatCapacity >
          0,
    );
    return {
      volumeHeatCapacity:
        dryBulkDensity * massHeatCapacity +
        waterVolumeFraction * waterVolumeHeatCapacity,
      diffusivity:
        conductivity /
        (dryBulkDensity * massHeatCapacity +
          waterVolumeFraction * waterVolumeHeatCapacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    conductivity: 2,
    dryBulkDensity: 1000,
    massHeatCapacity: 800,
    waterVolumeFraction: 0.2,
    waterVolumeHeatCapacity: 4000000,
  },
  output: { volumeHeatCapacity: 1600000, diffusivity: 0.00000125 },
} satisfies ToolExample<Input, Output>;
export const soilThermalDiffusivityCapacityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-thermal-diffusivity-capacity-term",
    title: "Soil Thermal Diffusivity Capacity Term Tool",
    description:
      "Calculate soil thermal diffusivity capacity term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conductivity: { type: "number", minimum: 0 },
        dryBulkDensity: { type: "number", minimum: 0 },
        massHeatCapacity: { type: "number", minimum: 0 },
        waterVolumeFraction: { type: "number", minimum: 0 },
        waterVolumeHeatCapacity: { type: "number", minimum: 0 },
      },
      required: [
        "conductivity",
        "dryBulkDensity",
        "massHeatCapacity",
        "waterVolumeFraction",
        "waterVolumeHeatCapacity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeHeatCapacity: { type: "number" },
        diffusivity: { type: "number" },
      },
      required: ["volumeHeatCapacity", "diffusivity"],
    },
    ports: {
      inputs: [
        {
          id: "conductivity",
          label: "Conductivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryBulkDensity",
          label: "Dry Bulk Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "massHeatCapacity",
          label: "Mass Heat Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterVolumeFraction",
          label: "Water Volume Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "waterVolumeHeatCapacity",
          label: "Water Volume Heat Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeHeatCapacity",
          label: "Volume Heat Capacity",
          valueType: { type: "number" },
        },
        {
          id: "diffusivity",
          label: "Diffusivity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilThermalDiffusivityCapacityTermTool.execute;
export default soilThermalDiffusivityCapacityTermTool;
