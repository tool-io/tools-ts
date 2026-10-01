import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly viewingDistance: number;
};
export type Output = {
  readonly horizontalRadians: number;
  readonly verticalRadians: number;
  readonly radialRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    centerX: { type: "number" },
    centerY: { type: "number" },
    viewingDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "y", "centerX", "centerY", "viewingDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalRadians: { type: "number" },
    verticalRadians: { type: "number" },
    radialRadians: { type: "number" },
  },
  required: ["horizontalRadians", "verticalRadians", "radialRadians"],
} as const;
/** Flat-screen geometric gaze offsets from explicitly calibrated coordinates and viewing distance, not an eye-tracker calibration or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, centerX, centerY, viewingDistance } = request;
  const compute = (): Output => {
    H.positive(viewingDistance);
    return {
      horizontalRadians: Math.atan2(x - centerX, viewingDistance),
      verticalRadians: Math.atan2(y - centerY, viewingDistance),
      radialRadians: Math.atan2(
        Math.hypot(x - centerX, y - centerY),
        viewingDistance,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 3, y: 4, centerX: 0, centerY: 0, viewingDistance: 10 },
  output: {
    horizontalRadians: 0.2914567944778671,
    verticalRadians: 0.3805063771123649,
    radialRadians: 0.4636476090008061,
  },
} satisfies ToolExample<Input, Output>;
export const eyeTrackerScreenGazeAngleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/eye-tracker-screen-gaze-angle-term",
    title: "Eye Tracker Screen Gaze Angle Term Tool",
    description:
      "Flat-screen geometric gaze offsets from explicitly calibrated coordinates and viewing distance, not an eye-tracker calibration or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        centerX: { type: "number" },
        centerY: { type: "number" },
        viewingDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "y", "centerX", "centerY", "viewingDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalRadians: { type: "number" },
        verticalRadians: { type: "number" },
        radialRadians: { type: "number" },
      },
      required: ["horizontalRadians", "verticalRadians", "radialRadians"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        {
          id: "centerX",
          label: "Center X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerY",
          label: "Center Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "viewingDistance",
          label: "Viewing Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalRadians",
          label: "Horizontal Radians",
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "verticalRadians",
          label: "Vertical Radians",
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "radialRadians",
          label: "Radial Radians",
          valueType: { type: "number", unit: "rad" },
        },
      ],
    },
  },
  calculate,
});
export const run = eyeTrackerScreenGazeAngleTermTool.execute;
export default eyeTrackerScreenGazeAngleTermTool;
