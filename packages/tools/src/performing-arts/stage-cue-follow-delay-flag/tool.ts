import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCue: number;
  readonly followDelay: number;
  readonly actualCue: number;
};
export type Output = {
  readonly targetCue: number;
  readonly timingGap: number;
  readonly late: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCue: { type: "number" },
    followDelay: { type: "number", minimum: 0 },
    actualCue: { type: "number" },
  },
  required: ["previousCue", "followDelay", "actualCue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetCue: { type: "number" },
    timingGap: { type: "number" },
    late: { type: "boolean" },
  },
  required: ["targetCue", "timingGap", "late"],
} as const;
/** Calculate stage cue follow delay flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCue, followDelay, actualCue } = request;
  const compute = (): Output => {
    H.domain(followDelay >= 0);
    return {
      targetCue: previousCue + followDelay,
      timingGap: actualCue - previousCue - followDelay,
      late: actualCue > previousCue + followDelay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCue: 10, followDelay: 3, actualCue: 14 },
  output: { targetCue: 13, timingGap: 1, late: true },
} satisfies ToolExample<Input, Output>;
export const stageCueFollowDelayFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/stage-cue-follow-delay-flag",
    title: "Stage Cue Follow Delay Flag Tool",
    description:
      "Calculate stage cue follow delay flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCue: { type: "number" },
        followDelay: { type: "number", minimum: 0 },
        actualCue: { type: "number" },
      },
      required: ["previousCue", "followDelay", "actualCue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetCue: { type: "number" },
        timingGap: { type: "number" },
        late: { type: "boolean" },
      },
      required: ["targetCue", "timingGap", "late"],
    },
    ports: {
      inputs: [
        {
          id: "previousCue",
          label: "Previous Cue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "followDelay",
          label: "Follow Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualCue",
          label: "Actual Cue",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "targetCue", label: "Target Cue", valueType: { type: "number" } },
        { id: "timingGap", label: "Timing Gap", valueType: { type: "number" } },
        { id: "late", label: "Late", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stageCueFollowDelayFlagTool.execute;
export default stageCueFollowDelayFlagTool;
