import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tangentSlope: number;
  readonly tangentTime: number;
  readonly tangentVolume: number;
  readonly recordedStart: number;
};
export type Output = {
  readonly extrapolatedZeroTime: number;
  readonly startOffset: number;
  readonly extrapolatedVolumeAtStart: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangentSlope: { type: "number" },
    tangentTime: { type: "number" },
    tangentVolume: { type: "number" },
    recordedStart: { type: "number" },
  },
  required: ["tangentSlope", "tangentTime", "tangentVolume", "recordedStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extrapolatedZeroTime: { type: "number" },
    startOffset: { type: "number" },
    extrapolatedVolumeAtStart: { type: "number" },
  },
  required: [
    "extrapolatedZeroTime",
    "startOffset",
    "extrapolatedVolumeAtStart",
  ],
} as const;
/** Zero-time intercept of a supplied waveform tangent, without selecting a tangent or judging spirometry acceptability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tangentSlope, tangentTime, tangentVolume, recordedStart } = request;
  const compute = (): Output => {
    H.domain(tangentSlope !== 0);
    return {
      extrapolatedZeroTime: tangentTime - tangentVolume / tangentSlope,
      startOffset: tangentTime - tangentVolume / tangentSlope - recordedStart,
      extrapolatedVolumeAtStart:
        tangentVolume + tangentSlope * (recordedStart - tangentTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tangentSlope: 4,
    tangentTime: 0.5,
    tangentVolume: 1,
    recordedStart: 0,
  },
  output: {
    extrapolatedZeroTime: 0.25,
    startOffset: 0.25,
    extrapolatedVolumeAtStart: -1,
  },
} satisfies ToolExample<Input, Output>;
export const spirometryStartTimeBackExtrapolatedOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pulmonology/spirometry-start-time-back-extrapolated-offset",
      title: "Spirometry Start Time Back Extrapolated Offset Tool",
      description:
        "Zero-time intercept of a supplied waveform tangent, without selecting a tangent or judging spirometry acceptability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tangentSlope: { type: "number" },
          tangentTime: { type: "number" },
          tangentVolume: { type: "number" },
          recordedStart: { type: "number" },
        },
        required: [
          "tangentSlope",
          "tangentTime",
          "tangentVolume",
          "recordedStart",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          extrapolatedZeroTime: { type: "number" },
          startOffset: { type: "number" },
          extrapolatedVolumeAtStart: { type: "number" },
        },
        required: [
          "extrapolatedZeroTime",
          "startOffset",
          "extrapolatedVolumeAtStart",
        ],
      },
      ports: {
        inputs: [
          {
            id: "tangentSlope",
            label: "Tangent Slope",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tangentTime",
            label: "Tangent Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tangentVolume",
            label: "Tangent Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recordedStart",
            label: "Recorded Start",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "extrapolatedZeroTime",
            label: "Extrapolated Zero Time",
            valueType: { type: "number" },
          },
          {
            id: "startOffset",
            label: "Start Offset",
            valueType: { type: "number" },
          },
          {
            id: "extrapolatedVolumeAtStart",
            label: "Extrapolated Volume At Start",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = spirometryStartTimeBackExtrapolatedOffsetTool.execute;
export default spirometryStartTimeBackExtrapolatedOffsetTool;
