import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slateStartFrames: number;
  readonly slateEndFrames: number;
  readonly framesPerSecond: number;
};
export type Output = {
  readonly durationFrames: number;
  readonly durationSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slateStartFrames: { type: "integer", minimum: 0 },
    slateEndFrames: { type: "integer" },
    framesPerSecond: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["slateStartFrames", "slateEndFrames", "framesPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationFrames: { type: "integer" },
    durationSeconds: { type: "number" },
  },
  required: ["durationFrames", "durationSeconds"],
} as const;
/** Measure a broadcast slate segment from half-open absolute frame boundaries; no timecode drop-frame convention is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slateStartFrames, slateEndFrames, framesPerSecond } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(slateStartFrames) &&
        slateStartFrames >= 0 &&
        slateStartFrames <= Number.MAX_SAFE_INTEGER,
      "slateStartFrames",
    ),
      slateStartFrames);
    (H.domain(
      Number.isSafeInteger(slateEndFrames) &&
        slateEndFrames >= slateStartFrames &&
        slateEndFrames <= Number.MAX_SAFE_INTEGER,
      "slateEndFrames",
    ),
      slateEndFrames);
    (H.domain(framesPerSecond > 0, "framesPerSecond"), framesPerSecond);
    return {
      durationFrames: slateEndFrames - slateStartFrames,
      durationSeconds: (slateEndFrames - slateStartFrames) / framesPerSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slateStartFrames: 100, slateEndFrames: 175, framesPerSecond: 25 },
  output: { durationFrames: 75, durationSeconds: 3 },
} satisfies ToolExample<Input, Output>;
export const broadcastSlateTimingSegmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/broadcast-slate-timing-segment",
    title: "Broadcast Slate Timing Segment Tool",
    description:
      "Measure a broadcast slate segment from half-open absolute frame boundaries; no timecode drop-frame convention is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slateStartFrames: { type: "integer", minimum: 0 },
        slateEndFrames: { type: "integer" },
        framesPerSecond: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["slateStartFrames", "slateEndFrames", "framesPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationFrames: { type: "integer" },
        durationSeconds: { type: "number" },
      },
      required: ["durationFrames", "durationSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "slateStartFrames",
          label: "Slate Start Frames",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "slateEndFrames",
          label: "Slate End Frames",
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
          id: "durationFrames",
          label: "Duration Frames",
          valueType: { type: "integer" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = broadcastSlateTimingSegmentTool.execute;
export default broadcastSlateTimingSegmentTool;
