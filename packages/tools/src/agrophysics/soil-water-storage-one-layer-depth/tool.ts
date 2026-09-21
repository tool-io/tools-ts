import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumetricWater: number;
  readonly layerDepth: number;
  readonly rockFraction: number;
};
export type Output = { readonly waterDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumetricWater: { type: "number", minimum: 0, maximum: 1 },
    layerDepth: { type: "number", minimum: 0 },
    rockFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["volumetricWater", "layerDepth", "rockFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterDepth: { type: "number" } },
  required: ["waterDepth"],
} as const;
/** Calculate soil water storage one layer depth from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumetricWater, layerDepth, rockFraction } = request;
  const compute = (): Output => {
    H.probability(volumetricWater);
    H.probability(rockFraction);
    H.domain(layerDepth >= 0);
    return { waterDepth: volumetricWater * layerDepth * (1 - rockFraction) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumetricWater: 0.3, layerDepth: 200, rockFraction: 0.1 },
  output: { waterDepth: 54 },
} satisfies ToolExample<Input, Output>;
export const soilWaterStorageOneLayerDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-water-storage-one-layer-depth",
    title: "Soil Water Storage One Layer Depth Tool",
    description:
      "Calculate soil water storage one layer depth from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumetricWater: { type: "number", minimum: 0, maximum: 1 },
        layerDepth: { type: "number", minimum: 0 },
        rockFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["volumetricWater", "layerDepth", "rockFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waterDepth: { type: "number" } },
      required: ["waterDepth"],
    },
    ports: {
      inputs: [
        {
          id: "volumetricWater",
          label: "Volumetric Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layerDepth",
          label: "Layer Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rockFraction",
          label: "Rock Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "waterDepth",
          label: "Water Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilWaterStorageOneLayerDepthTool.execute;
export default soilWaterStorageOneLayerDepthTool;
