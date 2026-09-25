import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly saturatedMass: number;
  readonly submergedApparentMass: number;
  readonly liquidDensity: number;
};
export type Output = {
  readonly bulkVolume: number;
  readonly accessiblePoreVolume: number;
  readonly accessiblePorosity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    saturatedMass: { type: "number" },
    submergedApparentMass: { type: "number" },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "dryMass",
    "saturatedMass",
    "submergedApparentMass",
    "liquidDensity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number" },
    accessiblePoreVolume: { type: "number" },
    accessiblePorosity: { type: "number" },
  },
  required: ["bulkVolume", "accessiblePoreVolume", "accessiblePorosity"],
} as const;
/** Archimedean saturated/submerged apparent-mass bulk volume and accessible pore volume, assuming complete saturation and matching tare corrections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, saturatedMass, submergedApparentMass, liquidDensity } =
    request;
  const compute = (): Output => {
    H.positive(liquidDensity);
    H.domain(
      saturatedMass >= dryMass &&
        dryMass >= submergedApparentMass &&
        saturatedMass > submergedApparentMass,
    );
    return {
      bulkVolume: (saturatedMass - submergedApparentMass) / liquidDensity,
      accessiblePoreVolume: (saturatedMass - dryMass) / liquidDensity,
      accessiblePorosity:
        (saturatedMass - dryMass) / (saturatedMass - submergedApparentMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dryMass: 200,
    saturatedMass: 220,
    submergedApparentMass: 120,
    liquidDensity: 1,
  },
  output: {
    bulkVolume: 100,
    accessiblePoreVolume: 20,
    accessiblePorosity: 0.2,
  },
} satisfies ToolExample<Input, Output>;
export const rockSampleBuoyancyCorrectedVolumeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/rock-sample-buoyancy-corrected-volume-term",
      title: "Rock Sample Buoyancy Corrected Volume Term Tool",
      description:
        "Archimedean saturated/submerged apparent-mass bulk volume and accessible pore volume, assuming complete saturation and matching tare corrections.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryMass: { type: "number" },
          saturatedMass: { type: "number" },
          submergedApparentMass: { type: "number" },
          liquidDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "dryMass",
          "saturatedMass",
          "submergedApparentMass",
          "liquidDensity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bulkVolume: { type: "number" },
          accessiblePoreVolume: { type: "number" },
          accessiblePorosity: { type: "number" },
        },
        required: ["bulkVolume", "accessiblePoreVolume", "accessiblePorosity"],
      },
      ports: {
        inputs: [
          {
            id: "dryMass",
            label: "Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "saturatedMass",
            label: "Saturated Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "submergedApparentMass",
            label: "Submerged Apparent Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "liquidDensity",
            label: "Liquid Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "bulkVolume",
            label: "Bulk Volume",
            valueType: { type: "number" },
          },
          {
            id: "accessiblePoreVolume",
            label: "Accessible Pore Volume",
            valueType: { type: "number" },
          },
          {
            id: "accessiblePorosity",
            label: "Accessible Porosity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rockSampleBuoyancyCorrectedVolumeTermTool.execute;
export default rockSampleBuoyancyCorrectedVolumeTermTool;
