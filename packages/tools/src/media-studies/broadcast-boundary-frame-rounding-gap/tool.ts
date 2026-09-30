import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startSeconds: number;
  readonly endSeconds: number;
  readonly framesPerSecond: number;
  readonly mode: string;
};
export type Output = {
  readonly roundedDuration: number;
  readonly gapSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startSeconds: { type: "number" },
    endSeconds: { type: "number" },
    framesPerSecond: { type: "number", exclusiveMinimum: 0 },
    mode: {
      type: "string",
      maxLength: 8192,
      enum: ["floor", "ceil", "nearest"],
    },
  },
  required: ["startSeconds", "endSeconds", "framesPerSecond", "mode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundedDuration: { type: "number" },
    gapSeconds: { type: "number" },
  },
  required: ["roundedDuration", "gapSeconds"],
} as const;
/** Quantize one elapsed interval to a frame grid under explicit floor, ceil or nearest-half-up rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startSeconds, endSeconds, framesPerSecond, mode } = request;
  const compute = (): Output => {
    H.positive(framesPerSecond);
    H.domain(
      endSeconds >= startSeconds && ["floor", "ceil", "nearest"].includes(mode),
    );
    return {
      roundedDuration:
        (mode === "floor"
          ? Math.floor((endSeconds - startSeconds) * framesPerSecond)
          : mode === "ceil"
            ? Math.ceil((endSeconds - startSeconds) * framesPerSecond)
            : Math.round((endSeconds - startSeconds) * framesPerSecond)) /
        framesPerSecond,
      gapSeconds:
        (mode === "floor"
          ? Math.floor((endSeconds - startSeconds) * framesPerSecond)
          : mode === "ceil"
            ? Math.ceil((endSeconds - startSeconds) * framesPerSecond)
            : Math.round((endSeconds - startSeconds) * framesPerSecond)) /
          framesPerSecond -
        (endSeconds - startSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startSeconds: 0,
    endSeconds: 1.25,
    framesPerSecond: 2,
    mode: "floor",
  },
  output: { roundedDuration: 1, gapSeconds: -0.25 },
} satisfies ToolExample<Input, Output>;
export const broadcastBoundaryFrameRoundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/broadcast-boundary-frame-rounding-gap",
    title: "Broadcast Boundary Frame Rounding Gap Tool",
    description:
      "Quantize one elapsed interval to a frame grid under explicit floor, ceil or nearest-half-up rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startSeconds: { type: "number" },
        endSeconds: { type: "number" },
        framesPerSecond: { type: "number", exclusiveMinimum: 0 },
        mode: {
          type: "string",
          maxLength: 8192,
          enum: ["floor", "ceil", "nearest"],
        },
      },
      required: ["startSeconds", "endSeconds", "framesPerSecond", "mode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundedDuration: { type: "number" },
        gapSeconds: { type: "number" },
      },
      required: ["roundedDuration", "gapSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "startSeconds",
          label: "Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endSeconds",
          label: "End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "framesPerSecond",
          label: "Frames Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "roundedDuration",
          label: "Rounded Duration",
          valueType: { type: "number" },
        },
        {
          id: "gapSeconds",
          label: "Gap Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = broadcastBoundaryFrameRoundingGapTool.execute;
export default broadcastBoundaryFrameRoundingGapTool;
