import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tankVolume: number;
  readonly bedGrossVolume: number;
  readonly mediaFraction: number;
};
export type Output = {
  readonly grossRatio: number;
  readonly waterCapacityRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tankVolume: { type: "number", minimum: 0 },
    bedGrossVolume: { type: "number", exclusiveMinimum: 0 },
    mediaFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["tankVolume", "bedGrossVolume", "mediaFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRatio: { type: "number" },
    waterCapacityRatio: { type: "number" },
  },
  required: ["grossRatio", "waterCapacityRatio"],
} as const;
/** Calculate aquaponic tankbed volume ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tankVolume, bedGrossVolume, mediaFraction } = request;
  const compute = (): Output => {
    H.domain(tankVolume >= 0 && mediaFraction >= 0 && mediaFraction < 1);
    H.positive(bedGrossVolume);
    return {
      grossRatio: tankVolume / bedGrossVolume,
      waterCapacityRatio: tankVolume / (bedGrossVolume * (1 - mediaFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tankVolume: 100, bedGrossVolume: 50, mediaFraction: 0.6 },
  output: { grossRatio: 2, waterCapacityRatio: 5 },
} satisfies ToolExample<Input, Output>;
export const aquaponicTankbedVolumeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/aquaponic-tankbed-volume-ratio",
    title: "Aquaponic Tankbed Volume Ratio Tool",
    description:
      "Calculate aquaponic tankbed volume ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tankVolume: { type: "number", minimum: 0 },
        bedGrossVolume: { type: "number", exclusiveMinimum: 0 },
        mediaFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["tankVolume", "bedGrossVolume", "mediaFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRatio: { type: "number" },
        waterCapacityRatio: { type: "number" },
      },
      required: ["grossRatio", "waterCapacityRatio"],
    },
    ports: {
      inputs: [
        {
          id: "tankVolume",
          label: "Tank Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedGrossVolume",
          label: "Bed Gross Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mediaFraction",
          label: "Media Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "grossRatio",
          label: "Gross Ratio",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "waterCapacityRatio",
          label: "Water Capacity Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicTankbedVolumeRatioTool.execute;
export default aquaponicTankbedVolumeRatioTool;
