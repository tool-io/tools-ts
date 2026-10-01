import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableFrames: number;
  readonly requiredFrames: number;
  readonly frameRate: number;
};
export type Output = {
  readonly slackFrames: number;
  readonly slackSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableFrames: { type: "integer", minimum: 0 },
    requiredFrames: { type: "integer", minimum: 0 },
    frameRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["availableFrames", "requiredFrames", "frameRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slackFrames: { type: "integer" },
    slackSeconds: { type: "number" },
  },
  required: ["slackFrames", "slackSeconds"],
} as const;
/** Calculate visual stimulus frame slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableFrames, requiredFrames, frameRate } = request;
  const compute = (): Output => {
    H.integer(availableFrames, 0);
    H.integer(requiredFrames, 0);
    H.positive(frameRate);
    return {
      slackFrames: availableFrames - requiredFrames,
      slackSeconds: (availableFrames - requiredFrames) / frameRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableFrames: 12, requiredFrames: 10, frameRate: 2 },
  output: { slackFrames: 2, slackSeconds: 1 },
} satisfies ToolExample<Input, Output>;
export const visualStimulusFrameSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/visual-stimulus-frame-slack",
    title: "Visual Stimulus Frame Slack Tool",
    description:
      "Calculate visual stimulus frame slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableFrames: { type: "integer", minimum: 0 },
        requiredFrames: { type: "integer", minimum: 0 },
        frameRate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["availableFrames", "requiredFrames", "frameRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slackFrames: { type: "integer" },
        slackSeconds: { type: "number" },
      },
      required: ["slackFrames", "slackSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "availableFrames",
          label: "Available Frames",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredFrames",
          label: "Required Frames",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameRate",
          label: "Frame Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "slackFrames",
          label: "Slack Frames",
          valueType: { type: "integer" },
        },
        {
          id: "slackSeconds",
          label: "Slack Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = visualStimulusFrameSlackTool.execute;
export default visualStimulusFrameSlackTool;
