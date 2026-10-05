import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preWaitSeconds: number;
  readonly actionSeconds: number;
  readonly postWaitSeconds: number;
};
export type Output = {
  readonly actionStartSeconds: number;
  readonly actionEndSeconds: number;
  readonly totalSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preWaitSeconds: { type: "number", minimum: 0 },
    actionSeconds: { type: "number", minimum: 0 },
    postWaitSeconds: { type: "number", minimum: 0 },
  },
  required: ["preWaitSeconds", "actionSeconds", "postWaitSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionStartSeconds: { type: "number" },
    actionEndSeconds: { type: "number" },
    totalSeconds: { type: "number" },
  },
  required: ["actionStartSeconds", "actionEndSeconds", "totalSeconds"],
} as const;
/** Lay out a cue's explicit pre-wait, action and post-wait durations relative to cue trigger zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preWaitSeconds, actionSeconds, postWaitSeconds } = request;
  const compute = (): Output => {
    H.domain(
      preWaitSeconds >= 0 && actionSeconds >= 0 && postWaitSeconds >= 0,
      "preWaitSeconds",
    );
    return {
      actionStartSeconds: preWaitSeconds,
      actionEndSeconds: preWaitSeconds + actionSeconds,
      totalSeconds: preWaitSeconds + actionSeconds + postWaitSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preWaitSeconds: 2, actionSeconds: 5, postWaitSeconds: 3 },
  output: { actionStartSeconds: 2, actionEndSeconds: 7, totalSeconds: 10 },
} satisfies ToolExample<Input, Output>;
export const cuePreWaitPostWaitSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/cue-pre-wait-post-wait-split",
    title: "Cue Pre Wait Post Wait Split Tool",
    description:
      "Lay out a cue's explicit pre-wait, action and post-wait durations relative to cue trigger zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preWaitSeconds: { type: "number", minimum: 0 },
        actionSeconds: { type: "number", minimum: 0 },
        postWaitSeconds: { type: "number", minimum: 0 },
      },
      required: ["preWaitSeconds", "actionSeconds", "postWaitSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionStartSeconds: { type: "number" },
        actionEndSeconds: { type: "number" },
        totalSeconds: { type: "number" },
      },
      required: ["actionStartSeconds", "actionEndSeconds", "totalSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "preWaitSeconds",
          label: "Pre Wait Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actionSeconds",
          label: "Action Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "postWaitSeconds",
          label: "Post Wait Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actionStartSeconds",
          label: "Action Start Seconds",
          valueType: { type: "number" },
        },
        {
          id: "actionEndSeconds",
          label: "Action End Seconds",
          valueType: { type: "number" },
        },
        {
          id: "totalSeconds",
          label: "Total Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cuePreWaitPostWaitSplitTool.execute;
export default cuePreWaitPostWaitSplitTool;
