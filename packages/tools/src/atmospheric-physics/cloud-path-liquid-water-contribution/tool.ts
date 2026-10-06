import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly liquidWaterContentGramsPerCubicMeter: number;
  readonly pathLengthMeters: number;
};
export type Output = { readonly liquidWaterPathGramsPerSquareMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    liquidWaterContentGramsPerCubicMeter: { type: "number", minimum: 0 },
    pathLengthMeters: { type: "number", minimum: 0 },
  },
  required: ["liquidWaterContentGramsPerCubicMeter", "pathLengthMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { liquidWaterPathGramsPerSquareMeter: { type: "number" } },
  required: ["liquidWaterPathGramsPerSquareMeter"],
} as const;
/** Integrate one uniform cloud layer’s explicitly supplied liquid-water content over its path length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { liquidWaterContentGramsPerCubicMeter, pathLengthMeters } = request;
  const compute = (): Output => {
    H.domain(
      liquidWaterContentGramsPerCubicMeter >= 0 && pathLengthMeters >= 0,
      "liquidWaterContentGramsPerCubicMeter",
    );
    return {
      liquidWaterPathGramsPerSquareMeter:
        liquidWaterContentGramsPerCubicMeter * pathLengthMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { liquidWaterContentGramsPerCubicMeter: 0.2, pathLengthMeters: 500 },
  output: { liquidWaterPathGramsPerSquareMeter: 100 },
} satisfies ToolExample<Input, Output>;
export const cloudPathLiquidWaterContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/cloud-path-liquid-water-contribution",
    title: "Cloud Path Liquid Water Contribution",
    description:
      "Integrate one uniform cloud layer’s explicitly supplied liquid-water content over its path length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        liquidWaterContentGramsPerCubicMeter: { type: "number", minimum: 0 },
        pathLengthMeters: { type: "number", minimum: 0 },
      },
      required: ["liquidWaterContentGramsPerCubicMeter", "pathLengthMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { liquidWaterPathGramsPerSquareMeter: { type: "number" } },
      required: ["liquidWaterPathGramsPerSquareMeter"],
    },
    ports: {
      inputs: [
        {
          id: "liquidWaterContentGramsPerCubicMeter",
          label: "Liquid Water Content Grams Per Cubic Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathLengthMeters",
          label: "Path Length Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "liquidWaterPathGramsPerSquareMeter",
          label: "Liquid Water Path Grams Per Square Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cloudPathLiquidWaterContributionTool.execute;
export default cloudPathLiquidWaterContributionTool;
