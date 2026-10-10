import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zeroBasedFrame: number;
  readonly frameRateHz: number;
  readonly startOffsetSeconds: number;
};
export type Output = { readonly eventSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroBasedFrame: { type: "integer", minimum: 0 },
    frameRateHz: { type: "number", exclusiveMinimum: 0 },
    startOffsetSeconds: { type: "number" },
  },
  required: ["zeroBasedFrame", "frameRateHz", "startOffsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eventSeconds: { type: "number" } },
  required: ["eventSeconds"],
} as const;
/** Locate an explicitly marked swallowing-video frame on a supplied constant-rate timeline without classifying the event. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zeroBasedFrame, frameRateHz, startOffsetSeconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(zeroBasedFrame) &&
        zeroBasedFrame >= 0 &&
        zeroBasedFrame <= Number.MAX_SAFE_INTEGER,
      "zeroBasedFrame",
    ),
      zeroBasedFrame);
    (H.domain(frameRateHz > 0, "frameRateHz"), frameRateHz);
    return { eventSeconds: startOffsetSeconds + zeroBasedFrame / frameRateHz };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zeroBasedFrame: 75, frameRateHz: 25, startOffsetSeconds: 2 },
  output: { eventSeconds: 5 },
} satisfies ToolExample<Input, Output>;
export const swallowingEventFrameIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/swallowing-event-frame-index",
    title: "Swallowing Event Frame Index",
    description:
      "Locate an explicitly marked swallowing-video frame on a supplied constant-rate timeline without classifying the event.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroBasedFrame: { type: "integer", minimum: 0 },
        frameRateHz: { type: "number", exclusiveMinimum: 0 },
        startOffsetSeconds: { type: "number" },
      },
      required: ["zeroBasedFrame", "frameRateHz", "startOffsetSeconds"],
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
          id: "frameRateHz",
          label: "Frame Rate Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startOffsetSeconds",
          label: "Start Offset Seconds",
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
export const run = swallowingEventFrameIndexTool.execute;
export default swallowingEventFrameIndexTool;
