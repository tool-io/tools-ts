import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameIndex: number;
  readonly referenceFrame: number;
  readonly framesPerSecond: number;
};
export type Output = { readonly latencySeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameIndex: { type: "integer", minimum: 0 },
    referenceFrame: { type: "integer", minimum: 0 },
    framesPerSecond: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["frameIndex", "referenceFrame", "framesPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latencySeconds: { type: "number" } },
  required: ["latencySeconds"],
} as const;
/** Reference an explicitly marked laryngeal video frame to a supplied reference frame and constant rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameIndex, referenceFrame, framesPerSecond } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(frameIndex) &&
        frameIndex >= 0 &&
        frameIndex <= Number.MAX_SAFE_INTEGER,
      "frameIndex",
    ),
      frameIndex);
    (H.domain(
      Number.isSafeInteger(referenceFrame) &&
        referenceFrame >= 0 &&
        referenceFrame <= Number.MAX_SAFE_INTEGER,
      "referenceFrame",
    ),
      referenceFrame);
    (H.domain(framesPerSecond > 0, "framesPerSecond"), framesPerSecond);
    return { latencySeconds: (frameIndex - referenceFrame) / framesPerSecond };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frameIndex: 130, referenceFrame: 100, framesPerSecond: 30 },
  output: { latencySeconds: 1 },
} satisfies ToolExample<Input, Output>;
export const laryngealVideoFrameLatencyTool = H.defineSchemaCalculation<
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
    id: "otolaryngology/laryngeal-video-frame-latency",
    title: "Laryngeal Video Frame Latency",
    description:
      "Reference an explicitly marked laryngeal video frame to a supplied reference frame and constant rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameIndex: { type: "integer", minimum: 0 },
        referenceFrame: { type: "integer", minimum: 0 },
        framesPerSecond: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["frameIndex", "referenceFrame", "framesPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { latencySeconds: { type: "number" } },
      required: ["latencySeconds"],
    },
    ports: {
      inputs: [
        {
          id: "frameIndex",
          label: "Frame Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceFrame",
          label: "Reference Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "framesPerSecond",
          label: "Frames Per Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "latencySeconds",
          label: "Latency Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = laryngealVideoFrameLatencyTool.execute;
export default laryngealVideoFrameLatencyTool;
