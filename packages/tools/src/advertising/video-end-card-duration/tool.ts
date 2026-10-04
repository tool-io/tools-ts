import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly videoSeconds: number;
  readonly endCardSeconds: number;
};
export type Output = {
  readonly mainContentSeconds: number;
  readonly endCardShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    videoSeconds: { type: "number", exclusiveMinimum: 0 },
    endCardSeconds: { type: "number", minimum: 0 },
  },
  required: ["videoSeconds", "endCardSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mainContentSeconds: { type: "number" },
    endCardShare: { type: "number" },
  },
  required: ["mainContentSeconds", "endCardShare"],
} as const;
/** Split an explicit video runtime into main content and end-card duration, without a platform duration rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { videoSeconds, endCardSeconds } = request;
  const compute = (): Output => {
    (H.domain(videoSeconds > 0, "videoSeconds"), videoSeconds);
    H.domain(
      endCardSeconds >= 0 && endCardSeconds <= videoSeconds,
      "endCardSeconds",
    );
    return {
      mainContentSeconds: videoSeconds - endCardSeconds,
      endCardShare: endCardSeconds / videoSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { videoSeconds: 30, endCardSeconds: 5 },
  output: { mainContentSeconds: 25, endCardShare: 0.16666666666666666 },
} satisfies ToolExample<Input, Output>;
export const videoEndCardDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/video-end-card-duration",
    title: "Video End Card Duration Tool",
    description:
      "Split an explicit video runtime into main content and end-card duration, without a platform duration rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        videoSeconds: { type: "number", exclusiveMinimum: 0 },
        endCardSeconds: { type: "number", minimum: 0 },
      },
      required: ["videoSeconds", "endCardSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mainContentSeconds: { type: "number" },
        endCardShare: { type: "number" },
      },
      required: ["mainContentSeconds", "endCardShare"],
    },
    ports: {
      inputs: [
        {
          id: "videoSeconds",
          label: "Video Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endCardSeconds",
          label: "End Card Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mainContentSeconds",
          label: "Main Content Seconds",
          valueType: { type: "number" },
        },
        {
          id: "endCardShare",
          label: "End Card Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = videoEndCardDurationTool.execute;
export default videoEndCardDurationTool;
