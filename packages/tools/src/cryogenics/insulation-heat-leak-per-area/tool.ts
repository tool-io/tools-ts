import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heatLeakWatts: number;
  readonly areaSquareMeters: number;
};
export type Output = { readonly wattsPerSquareMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heatLeakWatts: { type: "number", minimum: 0 },
    areaSquareMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["heatLeakWatts", "areaSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wattsPerSquareMeter: { type: "number" } },
  required: ["wattsPerSquareMeter"],
} as const;
/** Normalize a measured nonnegative cryogenic heat leak by an explicitly defined positive insulation area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heatLeakWatts, areaSquareMeters } = request;
  const compute = (): Output => {
    H.domain(heatLeakWatts >= 0, "heatLeakWatts");
    (H.domain(areaSquareMeters > 0, "areaSquareMeters"), areaSquareMeters);
    return { wattsPerSquareMeter: heatLeakWatts / areaSquareMeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heatLeakWatts: 12, areaSquareMeters: 3 },
  output: { wattsPerSquareMeter: 4 },
} satisfies ToolExample<Input, Output>;
export const insulationHeatLeakPerAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/insulation-heat-leak-per-area",
    title: "Insulation Heat Leak Per Area",
    description:
      "Normalize a measured nonnegative cryogenic heat leak by an explicitly defined positive insulation area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heatLeakWatts: { type: "number", minimum: 0 },
        areaSquareMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["heatLeakWatts", "areaSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wattsPerSquareMeter: { type: "number" } },
      required: ["wattsPerSquareMeter"],
    },
    ports: {
      inputs: [
        {
          id: "heatLeakWatts",
          label: "Heat Leak Watts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaSquareMeters",
          label: "Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wattsPerSquareMeter",
          label: "Watts Per Square Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insulationHeatLeakPerAreaTool.execute;
export default insulationHeatLeakPerAreaTool;
