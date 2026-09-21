import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gravimetricWater: number;
  readonly bulkDensity: number;
  readonly densityChange: number;
  readonly waterDensity: number;
};
export type Output = {
  readonly initialVolumetric: number;
  readonly volumetricChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gravimetricWater: { type: "number", minimum: 0 },
    bulkDensity: { type: "number", exclusiveMinimum: 0 },
    densityChange: { type: "number" },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "gravimetricWater",
    "bulkDensity",
    "densityChange",
    "waterDensity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolumetric: { type: "number" },
    volumetricChange: { type: "number" },
  },
  required: ["initialVolumetric", "volumetricChange"],
} as const;
/** Calculate soil water conversion bulk density sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gravimetricWater, bulkDensity, densityChange, waterDensity } =
    request;
  const compute = (): Output => {
    H.domain(
      gravimetricWater >= 0 &&
        bulkDensity > 0 &&
        bulkDensity + densityChange > 0,
    );
    H.positive(waterDensity);
    return {
      initialVolumetric: (gravimetricWater * bulkDensity) / waterDensity,
      volumetricChange: (gravimetricWater * densityChange) / waterDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gravimetricWater: 0.2,
    bulkDensity: 1200,
    densityChange: 100,
    waterDensity: 1000,
  },
  output: { initialVolumetric: 0.24, volumetricChange: 0.02 },
} satisfies ToolExample<Input, Output>;
export const soilWaterConversionBulkDensitySensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrophysics/soil-water-conversion-bulk-density-sensitivity",
      title: "Soil Water Conversion Bulk Density Sensitivity Tool",
      description:
        "Calculate soil water conversion bulk density sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gravimetricWater: { type: "number", minimum: 0 },
          bulkDensity: { type: "number", exclusiveMinimum: 0 },
          densityChange: { type: "number" },
          waterDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "gravimetricWater",
          "bulkDensity",
          "densityChange",
          "waterDensity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialVolumetric: { type: "number" },
          volumetricChange: { type: "number" },
        },
        required: ["initialVolumetric", "volumetricChange"],
      },
      ports: {
        inputs: [
          {
            id: "gravimetricWater",
            label: "Gravimetric Water",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bulkDensity",
            label: "Bulk Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "densityChange",
            label: "Density Change",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waterDensity",
            label: "Water Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "initialVolumetric",
            label: "Initial Volumetric",
            valueType: { type: "number" },
          },
          {
            id: "volumetricChange",
            label: "Volumetric Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = soilWaterConversionBulkDensitySensitivityTool.execute;
export default soilWaterConversionBulkDensitySensitivityTool;
