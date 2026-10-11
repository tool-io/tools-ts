import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bulkDensityKilogramsPerCubicMeter: number;
  readonly depthMeters: number;
  readonly carbonMassFraction: number;
};
export type Output = { readonly carbonKilogramsPerSquareMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkDensityKilogramsPerCubicMeter: { type: "number", minimum: 0 },
    depthMeters: { type: "number", minimum: 0 },
    carbonMassFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "bulkDensityKilogramsPerCubicMeter",
    "depthMeters",
    "carbonMassFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { carbonKilogramsPerSquareMeter: { type: "number" } },
  required: ["carbonKilogramsPerSquareMeter"],
} as const;
/** Calculate a uniform-layer carbon mass per area from explicit dry bulk density, depth, and carbon fraction without estimating sequestration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bulkDensityKilogramsPerCubicMeter, depthMeters, carbonMassFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      bulkDensityKilogramsPerCubicMeter >= 0 && depthMeters >= 0,
      "bulkDensityKilogramsPerCubicMeter",
    );
    (H.domain(
      carbonMassFraction >= 0 && carbonMassFraction <= 1,
      "carbonMassFraction",
    ),
      carbonMassFraction);
    return {
      carbonKilogramsPerSquareMeter:
        bulkDensityKilogramsPerCubicMeter * depthMeters * carbonMassFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bulkDensityKilogramsPerCubicMeter: 1200,
    depthMeters: 0.2,
    carbonMassFraction: 0.02,
  },
  output: { carbonKilogramsPerSquareMeter: 4.8 },
} satisfies ToolExample<Input, Output>;
export const soilCarbonDepthMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "sustainable-agriculture",
        "sustainable agriculture",
        "agriculture",
      ],
      keywords: ["sustainable agriculture", "agriculture"],
    },
    id: "sustainable-agriculture/soil-carbon-depth-mass-factor",
    title: "Soil Carbon Depth Mass Factor",
    description:
      "Calculate a uniform-layer carbon mass per area from explicit dry bulk density, depth, and carbon fraction without estimating sequestration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bulkDensityKilogramsPerCubicMeter: { type: "number", minimum: 0 },
        depthMeters: { type: "number", minimum: 0 },
        carbonMassFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "bulkDensityKilogramsPerCubicMeter",
        "depthMeters",
        "carbonMassFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { carbonKilogramsPerSquareMeter: { type: "number" } },
      required: ["carbonKilogramsPerSquareMeter"],
    },
    ports: {
      inputs: [
        {
          id: "bulkDensityKilogramsPerCubicMeter",
          label: "Bulk Density Kilograms Per Cubic Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depthMeters",
          label: "Depth Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carbonMassFraction",
          label: "Carbon Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "carbonKilogramsPerSquareMeter",
          label: "Carbon Kilograms Per Square Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilCarbonDepthMassFactorTool.execute;
export default soilCarbonDepthMassFactorTool;
