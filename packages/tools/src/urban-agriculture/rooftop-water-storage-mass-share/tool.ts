import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterVolume: number;
  readonly density: number;
  readonly totalSupportedMass: number;
};
export type Output = { readonly waterMass: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterVolume: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    totalSupportedMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["waterVolume", "density", "totalSupportedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterMass: { type: "number" }, share: { type: "number" } },
  required: ["waterMass", "share"],
} as const;
/** Compare supplied storage-water mass with a declared mass basis, not a structural load rating. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterVolume, density, totalSupportedMass } = request;
  const compute = (): Output => {
    H.domain(waterVolume >= 0);
    H.positive(density);
    H.positive(totalSupportedMass);
    return {
      waterMass: waterVolume * density,
      share: (waterVolume * density) / totalSupportedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterVolume: 2, density: 1000, totalSupportedMass: 4000 },
  output: { waterMass: 2000, share: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rooftopWaterStorageMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/rooftop-water-storage-mass-share",
    title: "Rooftop Water Storage Mass Share Tool",
    description:
      "Compare supplied storage-water mass with a declared mass basis, not a structural load rating.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterVolume: { type: "number", minimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
        totalSupportedMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["waterVolume", "density", "totalSupportedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waterMass: { type: "number" }, share: { type: "number" } },
      required: ["waterMass", "share"],
    },
    ports: {
      inputs: [
        {
          id: "waterVolume",
          label: "Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalSupportedMass",
          label: "Total Supported Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rooftopWaterStorageMassShareTool.execute;
export default rooftopWaterStorageMassShareTool;
