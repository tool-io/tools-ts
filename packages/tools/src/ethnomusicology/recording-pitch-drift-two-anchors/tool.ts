import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstRatio: number;
  readonly secondRatio: number;
  readonly time: number;
};
export type Output = {
  readonly interpolationFraction: number;
  readonly ratio: number;
  readonly cents: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    firstRatio: { type: "number", exclusiveMinimum: 0 },
    secondRatio: { type: "number", exclusiveMinimum: 0 },
    time: { type: "number" },
  },
  required: ["firstTime", "secondTime", "firstRatio", "secondRatio", "time"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interpolationFraction: { type: "number" },
    ratio: { type: "number" },
    cents: { type: "number" },
  },
  required: ["interpolationFraction", "ratio", "cents"],
} as const;
/** Linear interpolation in log frequency ratio, equivalent to constant cents drift between supplied calibration anchors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, firstRatio, secondRatio, time } = request;
  const compute = (): Output => {
    H.domain(secondTime > firstTime && time >= firstTime && time <= secondTime);
    H.positive(firstRatio);
    H.positive(secondRatio);
    return {
      interpolationFraction: (time - firstTime) / (secondTime - firstTime),
      ratio: Math.exp(
        Math.log(firstRatio) +
          ((time - firstTime) / (secondTime - firstTime)) *
            Math.log(secondRatio / firstRatio),
      ),
      cents:
        1200 *
        (Math.log2(firstRatio) +
          ((time - firstTime) / (secondTime - firstTime)) *
            Math.log2(secondRatio / firstRatio)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 0,
    secondTime: 10,
    firstRatio: 1,
    secondRatio: 4,
    time: 5,
  },
  output: { interpolationFraction: 0.5, ratio: 2, cents: 1200 },
} satisfies ToolExample<Input, Output>;
export const recordingPitchDriftTwoAnchorsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/recording-pitch-drift-two-anchors",
    title: "Recording Pitch Drift Two Anchors Tool",
    description:
      "Linear interpolation in log frequency ratio, equivalent to constant cents drift between supplied calibration anchors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        firstRatio: { type: "number", exclusiveMinimum: 0 },
        secondRatio: { type: "number", exclusiveMinimum: 0 },
        time: { type: "number" },
      },
      required: [
        "firstTime",
        "secondTime",
        "firstRatio",
        "secondRatio",
        "time",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interpolationFraction: { type: "number" },
        ratio: { type: "number" },
        cents: { type: "number" },
      },
      required: ["interpolationFraction", "ratio", "cents"],
    },
    ports: {
      inputs: [
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRatio",
          label: "First Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRatio",
          label: "Second Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "interpolationFraction",
          label: "Interpolation Fraction",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "cents", label: "Cents", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recordingPitchDriftTwoAnchorsTool.execute;
export default recordingPitchDriftTwoAnchorsTool;
