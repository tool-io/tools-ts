import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bulkVolume: number;
  readonly porosity: number;
  readonly waterMass: number;
  readonly waterDensity: number;
};
export type Output = {
  readonly poreVolume: number;
  readonly waterVolume: number;
  readonly saturation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number", exclusiveMinimum: 0 },
    porosity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    waterMass: { type: "number", minimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bulkVolume", "porosity", "waterMass", "waterDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poreVolume: { type: "number" },
    waterVolume: { type: "number" },
    saturation: { type: "number" },
  },
  required: ["poreVolume", "waterVolume", "saturation"],
} as const;
/** Water/pore-volume saturation from matched mass and volume units; values above one remain an audit-visible inconsistency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bulkVolume, porosity, waterMass, waterDensity } = request;
  const compute = (): Output => {
    H.positive(bulkVolume);
    H.domain(porosity > 0 && porosity <= 1 && waterMass >= 0);
    H.positive(waterDensity);
    return {
      poreVolume: bulkVolume * porosity,
      waterVolume: waterMass / waterDensity,
      saturation: waterMass / (waterDensity * bulkVolume * porosity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bulkVolume: 100, porosity: 0.2, waterMass: 10, waterDensity: 1 },
  output: { poreVolume: 20, waterVolume: 10, saturation: 0.5 },
} satisfies ToolExample<Input, Output>;
export const earthSampleWaterSaturationPoreVolumeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/earth-sample-water-saturation-pore-volume-term",
      title: "Earth Sample Water Saturation Pore Volume Term Tool",
      description:
        "Water/pore-volume saturation from matched mass and volume units; values above one remain an audit-visible inconsistency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bulkVolume: { type: "number", exclusiveMinimum: 0 },
          porosity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          waterMass: { type: "number", minimum: 0 },
          waterDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["bulkVolume", "porosity", "waterMass", "waterDensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          poreVolume: { type: "number" },
          waterVolume: { type: "number" },
          saturation: { type: "number" },
        },
        required: ["poreVolume", "waterVolume", "saturation"],
      },
      ports: {
        inputs: [
          {
            id: "bulkVolume",
            label: "Bulk Volume",
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
        ],
        outputs: [
          {
            id: "poreVolume",
            label: "Pore Volume",
            valueType: { type: "number" },
          },
          {
            id: "waterVolume",
            label: "Water Volume",
            valueType: { type: "number" },
          },
          {
            id: "saturation",
            label: "Saturation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = earthSampleWaterSaturationPoreVolumeTermTool.execute;
export default earthSampleWaterSaturationPoreVolumeTermTool;
