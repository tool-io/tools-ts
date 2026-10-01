import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levelDb: number;
  readonly durationHours: number;
  readonly referenceHours: number;
  readonly referenceLevelDb: number;
};
export type Output = {
  readonly relativeEnergy: number;
  readonly normalizedLevelDb: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelDb: { type: "number" },
    durationHours: { type: "number", exclusiveMinimum: 0 },
    referenceHours: { type: "number", exclusiveMinimum: 0 },
    referenceLevelDb: { type: "number" },
  },
  required: ["levelDb", "durationHours", "referenceHours", "referenceLevelDb"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeEnergy: { type: "number" },
    normalizedLevelDb: { type: "number" },
  },
  required: ["relativeEnergy", "normalizedLevelDb"],
} as const;
/** Equal-energy duration normalization with explicit references, without selecting an exposure limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levelDb, durationHours, referenceHours, referenceLevelDb } = request;
  const compute = (): Output => {
    H.positive(durationHours);
    H.positive(referenceHours);
    return {
      relativeEnergy:
        (durationHours / referenceHours) *
        10 ** ((levelDb - referenceLevelDb) / 10),
      normalizedLevelDb:
        levelDb + 10 * Math.log10(durationHours / referenceHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    levelDb: 90,
    durationHours: 4,
    referenceHours: 8,
    referenceLevelDb: 85,
  },
  output: {
    relativeEnergy: 1.5811388300841898,
    normalizedLevelDb: 86.98970004336019,
  },
} satisfies ToolExample<Input, Output>;
export const noiseExposureEnergyOneIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/noise-exposure-energy-one-interval",
    title: "Noise Exposure Energy One Interval Tool",
    description:
      "Equal-energy duration normalization with explicit references, without selecting an exposure limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levelDb: { type: "number" },
        durationHours: { type: "number", exclusiveMinimum: 0 },
        referenceHours: { type: "number", exclusiveMinimum: 0 },
        referenceLevelDb: { type: "number" },
      },
      required: [
        "levelDb",
        "durationHours",
        "referenceHours",
        "referenceLevelDb",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeEnergy: { type: "number" },
        normalizedLevelDb: { type: "number" },
      },
      required: ["relativeEnergy", "normalizedLevelDb"],
    },
    ports: {
      inputs: [
        {
          id: "levelDb",
          label: "Level Db",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationHours",
          label: "Duration Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHours",
          label: "Reference Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLevelDb",
          label: "Reference Level Db",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeEnergy",
          label: "Relative Energy",
          valueType: { type: "number" },
        },
        {
          id: "normalizedLevelDb",
          label: "Normalized Level Db",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = noiseExposureEnergyOneIntervalTool.execute;
export default noiseExposureEnergyOneIntervalTool;
