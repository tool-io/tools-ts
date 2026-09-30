import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousLastFrame: number;
  readonly nextFirstFrame: number;
};
export type Output = {
  readonly frameGap: number;
  readonly omittedFrames: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousLastFrame: { type: "integer", minimum: 0 },
    nextFirstFrame: { type: "integer", minimum: 0 },
  },
  required: ["previousLastFrame", "nextFirstFrame"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameGap: { type: "integer" },
    omittedFrames: { type: "integer" },
  },
  required: ["frameGap", "omittedFrames"],
} as const;
/** Calculate shot change frame gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousLastFrame, nextFirstFrame } = request;
  const compute = (): Output => {
    H.integer(previousLastFrame, 0);
    H.integer(nextFirstFrame, 0);
    return {
      frameGap: nextFirstFrame - previousLastFrame,
      omittedFrames: Math.max(0, nextFirstFrame - previousLastFrame - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousLastFrame: 20, nextFirstFrame: 24 },
  output: { frameGap: 4, omittedFrames: 3 },
} satisfies ToolExample<Input, Output>;
export const shotChangeFrameGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "media-studies/shot-change-frame-gap",
    title: "Shot Change Frame Gap Tool",
    description:
      "Calculate shot change frame gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousLastFrame: { type: "integer", minimum: 0 },
        nextFirstFrame: { type: "integer", minimum: 0 },
      },
      required: ["previousLastFrame", "nextFirstFrame"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameGap: { type: "integer" },
        omittedFrames: { type: "integer" },
      },
      required: ["frameGap", "omittedFrames"],
    },
    ports: {
      inputs: [
        {
          id: "previousLastFrame",
          label: "Previous Last Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextFirstFrame",
          label: "Next First Frame",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "frameGap", label: "Frame Gap", valueType: { type: "integer" } },
        {
          id: "omittedFrames",
          label: "Omitted Frames",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = shotChangeFrameGapTool.execute;
export default shotChangeFrameGapTool;
