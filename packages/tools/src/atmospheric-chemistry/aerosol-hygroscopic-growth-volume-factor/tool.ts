import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryDiameter: number;
  readonly growthFactor: number;
};
export type Output = {
  readonly wetDiameter: number;
  readonly volumeFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryDiameter: { type: "number", minimum: 0 },
    growthFactor: { type: "number", minimum: 1 },
  },
  required: ["dryDiameter", "growthFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetDiameter: { type: "number" },
    volumeFactor: { type: "number" },
  },
  required: ["wetDiameter", "volumeFactor"],
} as const;
/** Uniform spherical growth at a supplied diameter growth factor; no humidity-growth model is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryDiameter, growthFactor } = request;
  const compute = (): Output => {
    H.domain(dryDiameter >= 0 && growthFactor >= 1);
    return {
      wetDiameter: dryDiameter * growthFactor,
      volumeFactor: growthFactor ** 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryDiameter: 100, growthFactor: 1.5 },
  output: { wetDiameter: 150, volumeFactor: 3.375 },
} satisfies ToolExample<Input, Output>;
export const aerosolHygroscopicGrowthVolumeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/aerosol-hygroscopic-growth-volume-factor",
      title: "Aerosol Hygroscopic Growth Volume Factor Tool",
      description:
        "Uniform spherical growth at a supplied diameter growth factor; no humidity-growth model is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryDiameter: { type: "number", minimum: 0 },
          growthFactor: { type: "number", minimum: 1 },
        },
        required: ["dryDiameter", "growthFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wetDiameter: { type: "number" },
          volumeFactor: { type: "number" },
        },
        required: ["wetDiameter", "volumeFactor"],
      },
      ports: {
        inputs: [
          {
            id: "dryDiameter",
            label: "Dry Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "growthFactor",
            label: "Growth Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "wetDiameter",
            label: "Wet Diameter",
            valueType: { type: "number" },
          },
          {
            id: "volumeFactor",
            label: "Volume Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aerosolHygroscopicGrowthVolumeFactorTool.execute;
export default aerosolHygroscopicGrowthVolumeFactorTool;
