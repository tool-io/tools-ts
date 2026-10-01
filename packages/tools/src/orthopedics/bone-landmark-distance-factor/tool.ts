import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly calibrationFactor: number;
};
export type Output = { readonly calibratedDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    calibrationFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "calibrationFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { calibratedDistance: { type: "number" } },
  required: ["calibratedDistance"],
} as const;
/** Apply an explicit research landmark scale without normal ranges or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, calibrationFactor } = request;
  const compute = (): Output => {
    H.domain(distance >= 0);
    H.positive(calibrationFactor);
    return { calibratedDistance: distance * calibrationFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 12, calibrationFactor: 0.5 },
  output: { calibratedDistance: 6 },
} satisfies ToolExample<Input, Output>;
export const boneLandmarkDistanceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/bone-landmark-distance-factor",
    title: "Bone Landmark Distance Factor Tool",
    description:
      "Apply an explicit research landmark scale without normal ranges or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        calibrationFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["distance", "calibrationFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { calibratedDistance: { type: "number" } },
      required: ["calibratedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calibrationFactor",
          label: "Calibration Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calibratedDistance",
          label: "Calibrated Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boneLandmarkDistanceFactorTool.execute;
export default boneLandmarkDistanceFactorTool;
