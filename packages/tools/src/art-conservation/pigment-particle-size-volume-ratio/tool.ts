import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDiameter: number;
  readonly secondDiameter: number;
};
export type Output = {
  readonly diameterRatio: number;
  readonly volumeRatio: number;
  readonly surfaceToVolumeRatioFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDiameter: { type: "number", exclusiveMinimum: 0 },
    secondDiameter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstDiameter", "secondDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameterRatio: { type: "number" },
    volumeRatio: { type: "number" },
    surfaceToVolumeRatioFactor: { type: "number" },
  },
  required: ["diameterRatio", "volumeRatio", "surfaceToVolumeRatioFactor"],
} as const;
/** Equal-shape spherical particle scaling; no pigment chemistry or treatment conclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDiameter, secondDiameter } = request;
  const compute = (): Output => {
    H.positive(firstDiameter);
    H.positive(secondDiameter);
    return {
      diameterRatio: secondDiameter / firstDiameter,
      volumeRatio: (secondDiameter / firstDiameter) ** 3,
      surfaceToVolumeRatioFactor: firstDiameter / secondDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDiameter: 2, secondDiameter: 4 },
  output: { diameterRatio: 2, volumeRatio: 8, surfaceToVolumeRatioFactor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const pigmentParticleSizeVolumeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/pigment-particle-size-volume-ratio",
    title: "Pigment Particle Size Volume Ratio Tool",
    description:
      "Equal-shape spherical particle scaling; no pigment chemistry or treatment conclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDiameter: { type: "number", exclusiveMinimum: 0 },
        secondDiameter: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstDiameter", "secondDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameterRatio: { type: "number" },
        volumeRatio: { type: "number" },
        surfaceToVolumeRatioFactor: { type: "number" },
      },
      required: ["diameterRatio", "volumeRatio", "surfaceToVolumeRatioFactor"],
    },
    ports: {
      inputs: [
        {
          id: "firstDiameter",
          label: "First Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiameter",
          label: "Second Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diameterRatio",
          label: "Diameter Ratio",
          valueType: { type: "number" },
        },
        {
          id: "volumeRatio",
          label: "Volume Ratio",
          valueType: { type: "number" },
        },
        {
          id: "surfaceToVolumeRatioFactor",
          label: "Surface To Volume Ratio Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pigmentParticleSizeVolumeRatioTool.execute;
export default pigmentParticleSizeVolumeRatioTool;
