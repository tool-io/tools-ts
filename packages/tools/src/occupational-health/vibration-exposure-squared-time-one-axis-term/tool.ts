import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rmsAcceleration: number;
  readonly duration: number;
  readonly referenceDuration: number;
  readonly axisWeight: number;
};
export type Output = {
  readonly weightedAcceleration: number;
  readonly squaredContribution: number;
  readonly normalizedAcceleration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rmsAcceleration: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
    referenceDuration: { type: "number", exclusiveMinimum: 0 },
    axisWeight: { type: "number", minimum: 0 },
  },
  required: ["rmsAcceleration", "duration", "referenceDuration", "axisWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedAcceleration: { type: "number" },
    squaredContribution: { type: "number" },
    normalizedAcceleration: { type: "number" },
  },
  required: [
    "weightedAcceleration",
    "squaredContribution",
    "normalizedAcceleration",
  ],
} as const;
/** One supplied axis energy contribution with explicit duration and weighting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rmsAcceleration, duration, referenceDuration, axisWeight } = request;
  const compute = (): Output => {
    H.domain(rmsAcceleration >= 0 && duration >= 0 && axisWeight >= 0);
    H.positive(referenceDuration);
    return {
      weightedAcceleration: rmsAcceleration * axisWeight,
      squaredContribution:
        ((rmsAcceleration * axisWeight) ** 2 * duration) / referenceDuration,
      normalizedAcceleration:
        rmsAcceleration * axisWeight * Math.sqrt(duration / referenceDuration),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rmsAcceleration: 2,
    duration: 2,
    referenceDuration: 8,
    axisWeight: 1.4,
  },
  output: {
    weightedAcceleration: 2.8,
    squaredContribution: 1.9599999999999997,
    normalizedAcceleration: 1.4,
  },
} satisfies ToolExample<Input, Output>;
export const vibrationExposureSquaredTimeOneAxisTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-health/vibration-exposure-squared-time-one-axis-term",
      title: "Vibration Exposure Squared Time One Axis Term Tool",
      description:
        "One supplied axis energy contribution with explicit duration and weighting.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rmsAcceleration: { type: "number", minimum: 0 },
          duration: { type: "number", minimum: 0 },
          referenceDuration: { type: "number", exclusiveMinimum: 0 },
          axisWeight: { type: "number", minimum: 0 },
        },
        required: [
          "rmsAcceleration",
          "duration",
          "referenceDuration",
          "axisWeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedAcceleration: { type: "number" },
          squaredContribution: { type: "number" },
          normalizedAcceleration: { type: "number" },
        },
        required: [
          "weightedAcceleration",
          "squaredContribution",
          "normalizedAcceleration",
        ],
      },
      ports: {
        inputs: [
          {
            id: "rmsAcceleration",
            label: "Rms Acceleration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceDuration",
            label: "Reference Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "axisWeight",
            label: "Axis Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightedAcceleration",
            label: "Weighted Acceleration",
            valueType: { type: "number" },
          },
          {
            id: "squaredContribution",
            label: "Squared Contribution",
            valueType: { type: "number" },
          },
          {
            id: "normalizedAcceleration",
            label: "Normalized Acceleration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vibrationExposureSquaredTimeOneAxisTermTool.execute;
export default vibrationExposureSquaredTimeOneAxisTermTool;
