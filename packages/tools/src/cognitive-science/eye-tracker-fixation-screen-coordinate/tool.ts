import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawX: number;
  readonly rawY: number;
  readonly originX: number;
  readonly originY: number;
  readonly scaleX: number;
  readonly scaleY: number;
};
export type Output = { readonly screenX: number; readonly screenY: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawX: { type: "number" },
    rawY: { type: "number" },
    originX: { type: "number" },
    originY: { type: "number" },
    scaleX: { type: "number" },
    scaleY: { type: "number" },
  },
  required: ["rawX", "rawY", "originX", "originY", "scaleX", "scaleY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { screenX: { type: "number" }, screenY: { type: "number" } },
  required: ["screenX", "screenY"],
} as const;
/** Apply explicit axis origins and scale factors to a fixation coordinate without estimating gaze calibration or display geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawX, rawY, originX, originY, scaleX, scaleY } = request;
  const compute = (): Output => {
    H.domain(scaleX !== 0 && scaleY !== 0, "scaleX");
    return {
      screenX: (rawX - originX) * scaleX,
      screenY: (rawY - originY) * scaleY,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rawX: 110,
    rawY: 220,
    originX: 10,
    originY: 20,
    scaleX: 2,
    scaleY: 0.5,
  },
  output: { screenX: 200, screenY: 100 },
} satisfies ToolExample<Input, Output>;
export const eyeTrackerFixationScreenCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/eye-tracker-fixation-screen-coordinate",
    title: "Eye Tracker Fixation Screen Coordinate",
    description:
      "Apply explicit axis origins and scale factors to a fixation coordinate without estimating gaze calibration or display geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawX: { type: "number" },
        rawY: { type: "number" },
        originX: { type: "number" },
        originY: { type: "number" },
        scaleX: { type: "number" },
        scaleY: { type: "number" },
      },
      required: ["rawX", "rawY", "originX", "originY", "scaleX", "scaleY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { screenX: { type: "number" }, screenY: { type: "number" } },
      required: ["screenX", "screenY"],
    },
    ports: {
      inputs: [
        {
          id: "rawX",
          label: "Raw X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rawY",
          label: "Raw Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originX",
          label: "Origin X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originY",
          label: "Origin Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleX",
          label: "Scale X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleY",
          label: "Scale Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "screenX", label: "Screen X", valueType: { type: "number" } },
        { id: "screenY", label: "Screen Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eyeTrackerFixationScreenCoordinateTool.execute;
export default eyeTrackerFixationScreenCoordinateTool;
