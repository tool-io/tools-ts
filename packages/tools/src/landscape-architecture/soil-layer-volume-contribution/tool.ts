import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly thickness: number;
  readonly includedFraction: number;
};
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
    includedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["area", "thickness", "includedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Calculate soil layer volume contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, thickness, includedFraction } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && thickness >= 0);
    H.probability(includedFraction);
    return { volume: area * thickness * includedFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 20, thickness: 0.3, includedFraction: 0.5 },
  output: { volume: 3 },
} satisfies ToolExample<Input, Output>;
export const soilLayerVolumeContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/soil-layer-volume-contribution",
    title: "Soil Layer Volume Contribution Tool",
    description:
      "Calculate soil layer volume contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
        includedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["area", "thickness", "includedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includedFraction",
          label: "Included Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilLayerVolumeContributionTool.execute;
export default soilLayerVolumeContributionTool;
