import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zeroBasedFrame: number;
  readonly framesPerSecond: number;
  readonly originSeconds: number;
};
export type Output = { readonly eventSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroBasedFrame: { type: "integer", minimum: 0 },
    framesPerSecond: { type: "number", exclusiveMinimum: 0 },
    originSeconds: { type: "number" },
  },
  required: ["zeroBasedFrame", "framesPerSecond", "originSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eventSeconds: { type: "number" } },
  required: ["eventSeconds"],
} as const;
/** Locate an explicitly marked gait-video frame on a supplied constant-rate timeline without detecting gait events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zeroBasedFrame, framesPerSecond, originSeconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(zeroBasedFrame) &&
        zeroBasedFrame >= 0 &&
        zeroBasedFrame <= Number.MAX_SAFE_INTEGER,
      "zeroBasedFrame",
    ),
      zeroBasedFrame);
    (H.domain(framesPerSecond > 0, "framesPerSecond"), framesPerSecond);
    return { eventSeconds: originSeconds + zeroBasedFrame / framesPerSecond };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zeroBasedFrame: 75, framesPerSecond: 25, originSeconds: 2 },
  output: { eventSeconds: 5 },
} satisfies ToolExample<Input, Output>;
export const gaitVideoEventFrameTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/gait-video-event-frame-time",
    title: "Gait Video Event Frame Time",
    description:
      "Locate an explicitly marked gait-video frame on a supplied constant-rate timeline without detecting gait events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroBasedFrame: { type: "integer", minimum: 0 },
        framesPerSecond: { type: "number", exclusiveMinimum: 0 },
        originSeconds: { type: "number" },
      },
      required: ["zeroBasedFrame", "framesPerSecond", "originSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eventSeconds: { type: "number" } },
      required: ["eventSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "zeroBasedFrame",
          label: "Zero Based Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "framesPerSecond",
          label: "Frames Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originSeconds",
          label: "Origin Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eventSeconds",
          label: "Event Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaitVideoEventFrameTimeTool.execute;
export default gaitVideoEventFrameTimeTool;
