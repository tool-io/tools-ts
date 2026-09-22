import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleVolume: number;
  readonly porosity: number;
  readonly waterSaturation: number;
};
export type Output = {
  readonly poreVolume: number;
  readonly poreWaterVolume: number;
  readonly waterVolumeFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleVolume: { type: "number", minimum: 0 },
    porosity: { type: "number", minimum: 0, maximum: 1 },
    waterSaturation: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["sampleVolume", "porosity", "waterSaturation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poreVolume: { type: "number" },
    poreWaterVolume: { type: "number" },
    waterVolumeFraction: { type: "number" },
  },
  required: ["poreVolume", "poreWaterVolume", "waterVolumeFraction"],
} as const;
/** Calculate sediment pore water volume fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleVolume, porosity, waterSaturation } = request;
  const compute = (): Output => {
    H.domain(sampleVolume >= 0);
    H.probability(porosity);
    H.probability(waterSaturation);
    return {
      poreVolume: sampleVolume * porosity,
      poreWaterVolume: sampleVolume * porosity * waterSaturation,
      waterVolumeFraction: porosity * waterSaturation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleVolume: 100, porosity: 0.4, waterSaturation: 0.75 },
  output: {
    poreVolume: 40,
    poreWaterVolume: 30,
    waterVolumeFraction: 0.30000000000000004,
  },
} satisfies ToolExample<Input, Output>;
export const sedimentPoreWaterVolumeFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/sediment-pore-water-volume-fraction",
    title: "Sediment Pore Water Volume Fraction Tool",
    description:
      "Calculate sediment pore water volume fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleVolume: { type: "number", minimum: 0 },
        porosity: { type: "number", minimum: 0, maximum: 1 },
        waterSaturation: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["sampleVolume", "porosity", "waterSaturation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poreVolume: { type: "number" },
        poreWaterVolume: { type: "number" },
        waterVolumeFraction: { type: "number" },
      },
      required: ["poreVolume", "poreWaterVolume", "waterVolumeFraction"],
    },
    ports: {
      inputs: [
        {
          id: "sampleVolume",
          label: "Sample Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "porosity",
          label: "Porosity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterSaturation",
          label: "Water Saturation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "poreVolume",
          label: "Pore Volume",
          valueType: { type: "number" },
        },
        {
          id: "poreWaterVolume",
          label: "Pore Water Volume",
          valueType: { type: "number" },
        },
        {
          id: "waterVolumeFraction",
          label: "Water Volume Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sedimentPoreWaterVolumeFractionTool.execute;
export default sedimentPoreWaterVolumeFractionTool;
