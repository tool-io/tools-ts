import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levelReading: number;
  readonly suppliedVolumePerLevel: number;
  readonly zeroLevel: number;
  readonly recordedVolume: number;
};
export type Output = {
  readonly derivedVolume: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelReading: { type: "number" },
    suppliedVolumePerLevel: { type: "number", exclusiveMinimum: 0 },
    zeroLevel: { type: "number" },
    recordedVolume: { type: "number" },
  },
  required: [
    "levelReading",
    "suppliedVolumePerLevel",
    "zeroLevel",
    "recordedVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivedVolume: { type: "number" },
    residual: { type: "number" },
  },
  required: ["derivedVolume", "residual"],
} as const;
/** Compare supplied local linear level/volume calibration with a recorded volume without inferring reservoir shape or nutrient needs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levelReading, suppliedVolumePerLevel, zeroLevel, recordedVolume } =
    request;
  const compute = (): Output => {
    H.positive(suppliedVolumePerLevel);
    return {
      derivedVolume: (levelReading - zeroLevel) * suppliedVolumePerLevel,
      residual:
        recordedVolume - (levelReading - zeroLevel) * suppliedVolumePerLevel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    levelReading: 12,
    suppliedVolumePerLevel: 5,
    zeroLevel: 2,
    recordedVolume: 48,
  },
  output: { derivedVolume: 50, residual: -2 },
} satisfies ToolExample<Input, Output>;
export const reservoirVolumeMarkResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/reservoir-volume-mark-residual",
    title: "Reservoir Volume Mark Residual Tool",
    description:
      "Compare supplied local linear level/volume calibration with a recorded volume without inferring reservoir shape or nutrient needs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levelReading: { type: "number" },
        suppliedVolumePerLevel: { type: "number", exclusiveMinimum: 0 },
        zeroLevel: { type: "number" },
        recordedVolume: { type: "number" },
      },
      required: [
        "levelReading",
        "suppliedVolumePerLevel",
        "zeroLevel",
        "recordedVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivedVolume: { type: "number" },
        residual: { type: "number" },
      },
      required: ["derivedVolume", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "levelReading",
          label: "Level Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVolumePerLevel",
          label: "Supplied Volume Per Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroLevel",
          label: "Zero Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedVolume",
          label: "Recorded Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivedVolume",
          label: "Derived Volume",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reservoirVolumeMarkResidualTool.execute;
export default reservoirVolumeMarkResidualTool;
