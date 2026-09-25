import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startSeconds: number;
  readonly endSeconds: number;
  readonly playbackRate: number;
};
export type Output = {
  readonly sourceDuration: number;
  readonly playbackDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startSeconds: { type: "number", minimum: 0 },
    endSeconds: { type: "number" },
    playbackRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["startSeconds", "endSeconds", "playbackRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDuration: { type: "number" },
    playbackDuration: { type: "number" },
  },
  required: ["sourceDuration", "playbackDuration"],
} as const;
/** Calculate iiif range one canvas duration term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startSeconds, endSeconds, playbackRate } = request;
  const compute = (): Output => {
    H.domain(startSeconds >= 0 && endSeconds >= startSeconds);
    H.positive(playbackRate);
    return {
      sourceDuration: endSeconds - startSeconds,
      playbackDuration: (endSeconds - startSeconds) / playbackRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startSeconds: 10, endSeconds: 40, playbackRate: 1.5 },
  output: { sourceDuration: 30, playbackDuration: 20 },
} satisfies ToolExample<Input, Output>;
export const iiifRangeOneCanvasDurationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-range-one-canvas-duration-term",
    title: "IIIF Range One Canvas Duration Term Tool",
    description:
      "Calculate iiif range one canvas duration term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startSeconds: { type: "number", minimum: 0 },
        endSeconds: { type: "number" },
        playbackRate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["startSeconds", "endSeconds", "playbackRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceDuration: { type: "number" },
        playbackDuration: { type: "number" },
      },
      required: ["sourceDuration", "playbackDuration"],
    },
    ports: {
      inputs: [
        {
          id: "startSeconds",
          label: "Start Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "endSeconds",
          label: "End Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "playbackRate",
          label: "Playback Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sourceDuration",
          label: "Source Duration",
          valueType: { type: "number" },
        },
        {
          id: "playbackDuration",
          label: "Playback Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = iiifRangeOneCanvasDurationTermTool.execute;
export default iiifRangeOneCanvasDurationTermTool;
