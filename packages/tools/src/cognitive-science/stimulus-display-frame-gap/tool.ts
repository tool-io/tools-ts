import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedOnset: number;
  readonly displayedOnset: number;
  readonly frameDuration: number;
};
export type Output = {
  readonly onsetGap: number;
  readonly gapInFrames: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedOnset: { type: "number" },
    displayedOnset: { type: "number" },
    frameDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["requestedOnset", "displayedOnset", "frameDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { onsetGap: { type: "number" }, gapInFrames: { type: "number" } },
  required: ["onsetGap", "gapInFrames"],
} as const;
/** Compare supplied research display timestamps in explicit frame-duration units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedOnset, displayedOnset, frameDuration } = request;
  const compute = (): Output => {
    H.positive(frameDuration);
    return {
      onsetGap: displayedOnset - requestedOnset,
      gapInFrames: (displayedOnset - requestedOnset) / frameDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedOnset: 1, displayedOnset: 1.04, frameDuration: 0.02 },
  output: { onsetGap: 0.040000000000000036, gapInFrames: 2.0000000000000018 },
} satisfies ToolExample<Input, Output>;
export const stimulusDisplayFrameGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/stimulus-display-frame-gap",
    title: "Stimulus Display Frame Gap Tool",
    description:
      "Compare supplied research display timestamps in explicit frame-duration units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedOnset: { type: "number" },
        displayedOnset: { type: "number" },
        frameDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["requestedOnset", "displayedOnset", "frameDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onsetGap: { type: "number" },
        gapInFrames: { type: "number" },
      },
      required: ["onsetGap", "gapInFrames"],
    },
    ports: {
      inputs: [
        {
          id: "requestedOnset",
          label: "Requested Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displayedOnset",
          label: "Displayed Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frameDuration",
          label: "Frame Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "onsetGap", label: "Onset Gap", valueType: { type: "number" } },
        {
          id: "gapInFrames",
          label: "Gap In Frames",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stimulusDisplayFrameGapTool.execute;
export default stimulusDisplayFrameGapTool;
