import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterMass: number;
  readonly waterDensity: number;
  readonly aliquotFraction: number;
};
export type Output = {
  readonly subsampleVolume: number;
  readonly wholeEquivalentVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number", minimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
    aliquotFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["waterMass", "waterDensity", "aliquotFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsampleVolume: { type: "number" },
    wholeEquivalentVolume: { type: "number" },
  },
  required: ["subsampleVolume", "wholeEquivalentVolume"],
} as const;
/** Calculate soil pore water volume subsample term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterMass, waterDensity, aliquotFraction } = request;
  const compute = (): Output => {
    H.domain(waterMass >= 0 && aliquotFraction > 0 && aliquotFraction <= 1);
    H.positive(waterDensity);
    return {
      subsampleVolume: waterMass / waterDensity,
      wholeEquivalentVolume: waterMass / (waterDensity * aliquotFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterMass: 10, waterDensity: 1, aliquotFraction: 0.2 },
  output: { subsampleVolume: 10, wholeEquivalentVolume: 50 },
} satisfies ToolExample<Input, Output>;
export const soilPoreWaterVolumeSubsampleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-pore-water-volume-subsample-term",
    title: "Soil Pore Water Volume Subsample Term Tool",
    description:
      "Calculate soil pore water volume subsample term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number", minimum: 0 },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
        aliquotFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["waterMass", "waterDensity", "aliquotFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subsampleVolume: { type: "number" },
        wholeEquivalentVolume: { type: "number" },
      },
      required: ["subsampleVolume", "wholeEquivalentVolume"],
    },
    ports: {
      inputs: [
        {
          id: "waterMass",
          label: "Water Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aliquotFraction",
          label: "Aliquot Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "subsampleVolume",
          label: "Subsample Volume",
          valueType: { type: "number" },
        },
        {
          id: "wholeEquivalentVolume",
          label: "Whole Equivalent Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilPoreWaterVolumeSubsampleTermTool.execute;
export default soilPoreWaterVolumeSubsampleTermTool;
