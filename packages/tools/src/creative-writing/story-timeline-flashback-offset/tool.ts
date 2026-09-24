import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentAnchor: number;
  readonly sceneAnchor: number;
  readonly duration: number;
};
export type Output = {
  readonly offset: number;
  readonly endAnchor: number;
  readonly returnsBeforePresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentAnchor: { type: "number" },
    sceneAnchor: { type: "number" },
    duration: { type: "number", minimum: 0 },
  },
  required: ["presentAnchor", "sceneAnchor", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "number" },
    endAnchor: { type: "number" },
    returnsBeforePresent: { type: "boolean" },
  },
  required: ["offset", "endAnchor", "returnsBeforePresent"],
} as const;
/** Use a common unfolded time unit; negative offsets denote earlier scene anchors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentAnchor, sceneAnchor, duration } = request;
  const compute = (): Output => {
    H.domain(duration >= 0);
    return {
      offset: sceneAnchor - presentAnchor,
      endAnchor: sceneAnchor + duration,
      returnsBeforePresent: sceneAnchor + duration <= presentAnchor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentAnchor: 100, sceneAnchor: 70, duration: 20 },
  output: { offset: -30, endAnchor: 90, returnsBeforePresent: true },
} satisfies ToolExample<Input, Output>;
export const storyTimelineFlashbackOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/story-timeline-flashback-offset",
    title: "Story Timeline Flashback Offset Tool",
    description:
      "Use a common unfolded time unit; negative offsets denote earlier scene anchors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentAnchor: { type: "number" },
        sceneAnchor: { type: "number" },
        duration: { type: "number", minimum: 0 },
      },
      required: ["presentAnchor", "sceneAnchor", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "number" },
        endAnchor: { type: "number" },
        returnsBeforePresent: { type: "boolean" },
      },
      required: ["offset", "endAnchor", "returnsBeforePresent"],
    },
    ports: {
      inputs: [
        {
          id: "presentAnchor",
          label: "Present Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sceneAnchor",
          label: "Scene Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        { id: "endAnchor", label: "End Anchor", valueType: { type: "number" } },
        {
          id: "returnsBeforePresent",
          label: "Returns Before Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = storyTimelineFlashbackOffsetTool.execute;
export default storyTimelineFlashbackOffsetTool;
