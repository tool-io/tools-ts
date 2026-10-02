import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedMinutes: number;
  readonly missingMinutes: number;
  readonly offDeviceMinutes: number;
  readonly totalMinutes: number;
};
export type Output = {
  readonly observedWearMinutes: number;
  readonly observedFraction: number;
  readonly possibleWearUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedMinutes: { type: "number", minimum: 0 },
    missingMinutes: { type: "number", minimum: 0 },
    offDeviceMinutes: { type: "number", minimum: 0 },
    totalMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "recordedMinutes",
    "missingMinutes",
    "offDeviceMinutes",
    "totalMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedWearMinutes: { type: "number" },
    observedFraction: { type: "number" },
    possibleWearUpper: { type: "number" },
  },
  required: ["observedWearMinutes", "observedFraction", "possibleWearUpper"],
} as const;
/** Calculate podiatry diary wear interval completeness from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedMinutes, missingMinutes, offDeviceMinutes, totalMinutes } =
    request;
  const compute = (): Output => {
    H.positive(totalMinutes);
    H.domain(
      recordedMinutes >= 0 &&
        missingMinutes >= 0 &&
        recordedMinutes + missingMinutes <= totalMinutes &&
        offDeviceMinutes >= 0 &&
        offDeviceMinutes <= recordedMinutes,
    );
    return {
      observedWearMinutes: recordedMinutes - offDeviceMinutes,
      observedFraction: recordedMinutes / totalMinutes,
      possibleWearUpper: recordedMinutes - offDeviceMinutes + missingMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedMinutes: 600,
    missingMinutes: 100,
    offDeviceMinutes: 120,
    totalMinutes: 720,
  },
  output: {
    observedWearMinutes: 480,
    observedFraction: 0.8333333333333334,
    possibleWearUpper: 580,
  },
} satisfies ToolExample<Input, Output>;
export const podiatryDiaryWearIntervalCompletenessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "podiatry/podiatry-diary-wear-interval-completeness",
      title: "Podiatry Diary Wear Interval Completeness Tool",
      description:
        "Calculate podiatry diary wear interval completeness from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedMinutes: { type: "number", minimum: 0 },
          missingMinutes: { type: "number", minimum: 0 },
          offDeviceMinutes: { type: "number", minimum: 0 },
          totalMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "recordedMinutes",
          "missingMinutes",
          "offDeviceMinutes",
          "totalMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedWearMinutes: { type: "number" },
          observedFraction: { type: "number" },
          possibleWearUpper: { type: "number" },
        },
        required: [
          "observedWearMinutes",
          "observedFraction",
          "possibleWearUpper",
        ],
      },
      ports: {
        inputs: [
          {
            id: "recordedMinutes",
            label: "Recorded Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "missingMinutes",
            label: "Missing Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "offDeviceMinutes",
            label: "Off Device Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalMinutes",
            label: "Total Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "observedWearMinutes",
            label: "Observed Wear Minutes",
            valueType: { type: "number" },
          },
          {
            id: "observedFraction",
            label: "Observed Fraction",
            valueType: { type: "number" },
          },
          {
            id: "possibleWearUpper",
            label: "Possible Wear Upper",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = podiatryDiaryWearIntervalCompletenessTool.execute;
export default podiatryDiaryWearIntervalCompletenessTool;
