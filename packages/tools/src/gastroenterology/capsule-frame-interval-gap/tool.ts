import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFrame: number;
  readonly secondFrame: number;
  readonly secondsPerFrame: number;
};
export type Output = {
  readonly frameGap: number;
  readonly elapsedSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFrame: { type: "integer", minimum: 0 },
    secondFrame: { type: "integer", minimum: 0 },
    secondsPerFrame: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstFrame", "secondFrame", "secondsPerFrame"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameGap: { type: "integer" },
    elapsedSeconds: { type: "number" },
  },
  required: ["frameGap", "elapsedSeconds"],
} as const;
/** Compare research capsule-image indices using an explicit frame period; no diagnostic finding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFrame, secondFrame, secondsPerFrame } = request;
  const compute = (): Output => {
    H.integer(firstFrame, 0);
    H.integer(secondFrame, 0);
    H.positive(secondsPerFrame);
    return {
      frameGap: secondFrame - firstFrame,
      elapsedSeconds: (secondFrame - firstFrame) * secondsPerFrame,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFrame: 100, secondFrame: 130, secondsPerFrame: 0.5 },
  output: { frameGap: 30, elapsedSeconds: 15 },
} satisfies ToolExample<Input, Output>;
export const capsuleFrameIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/capsule-frame-interval-gap",
    title: "Capsule Frame Interval Gap Tool",
    description:
      "Compare research capsule-image indices using an explicit frame period; no diagnostic finding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFrame: { type: "integer", minimum: 0 },
        secondFrame: { type: "integer", minimum: 0 },
        secondsPerFrame: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstFrame", "secondFrame", "secondsPerFrame"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameGap: { type: "integer" },
        elapsedSeconds: { type: "number" },
      },
      required: ["frameGap", "elapsedSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "firstFrame",
          label: "First Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondFrame",
          label: "Second Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondsPerFrame",
          label: "Seconds Per Frame",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "frameGap", label: "Frame Gap", valueType: { type: "integer" } },
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capsuleFrameIntervalGapTool.execute;
export default capsuleFrameIntervalGapTool;
