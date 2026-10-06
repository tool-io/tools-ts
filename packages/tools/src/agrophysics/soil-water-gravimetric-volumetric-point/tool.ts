import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gravimetricWaterFraction: number;
  readonly dryBulkDensity: number;
  readonly waterDensity: number;
};
export type Output = { readonly volumetricWaterFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gravimetricWaterFraction: { type: "number", minimum: 0 },
    dryBulkDensity: { type: "number", minimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["gravimetricWaterFraction", "dryBulkDensity", "waterDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumetricWaterFraction: { type: "number" } },
  required: ["volumetricWaterFraction"],
} as const;
/** Convert explicit water mass per dry-soil mass to water-volume per bulk-soil volume using supplied compatible densities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gravimetricWaterFraction, dryBulkDensity, waterDensity } = request;
  const compute = (): Output => {
    H.domain(
      gravimetricWaterFraction >= 0 && dryBulkDensity >= 0,
      "gravimetricWaterFraction",
    );
    (H.domain(waterDensity > 0, "waterDensity"), waterDensity);
    return {
      volumetricWaterFraction:
        (gravimetricWaterFraction * dryBulkDensity) / waterDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gravimetricWaterFraction: 0.2,
    dryBulkDensity: 1.5,
    waterDensity: 1,
  },
  output: { volumetricWaterFraction: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const soilWaterGravimetricVolumetricPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["agrophysics", "agriculture"],
        keywords: ["agrophysics", "agriculture"],
      },
      id: "agrophysics/soil-water-gravimetric-volumetric-point",
      title: "Soil Water Gravimetric Volumetric Point",
      description:
        "Convert explicit water mass per dry-soil mass to water-volume per bulk-soil volume using supplied compatible densities.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gravimetricWaterFraction: { type: "number", minimum: 0 },
          dryBulkDensity: { type: "number", minimum: 0 },
          waterDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "gravimetricWaterFraction",
          "dryBulkDensity",
          "waterDensity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { volumetricWaterFraction: { type: "number" } },
        required: ["volumetricWaterFraction"],
      },
      ports: {
        inputs: [
          {
            id: "gravimetricWaterFraction",
            label: "Gravimetric Water Fraction",
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
            id: "waterDensity",
            label: "Water Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "volumetricWaterFraction",
            label: "Volumetric Water Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = soilWaterGravimetricVolumetricPointTool.execute;
export default soilWaterGravimetricVolumetricPointTool;
