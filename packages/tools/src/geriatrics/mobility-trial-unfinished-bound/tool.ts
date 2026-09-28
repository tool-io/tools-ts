import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly completed: boolean;
  readonly completionLimit: number;
};
export type Output = {
  readonly durationLower: number;
  readonly durationUpper: number;
  readonly upperKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    completed: { type: "boolean" },
    completionLimit: { type: "number" },
  },
  required: ["elapsed", "completed", "completionLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationLower: { type: "number" },
    durationUpper: { type: "number" },
    upperKnown: { type: "boolean" },
  },
  required: ["durationLower", "durationUpper", "upperKnown"],
} as const;
/** Preserve an unfinished research trial as right-censored; the unused upper value is a supplied recording limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, completed, completionLimit } = request;
  const compute = (): Output => {
    H.domain(elapsed >= 0 && completionLimit >= elapsed);
    return {
      durationLower: elapsed,
      durationUpper: completed ? elapsed : completionLimit,
      upperKnown: completed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 20, completed: false, completionLimit: 60 },
  output: { durationLower: 20, durationUpper: 60, upperKnown: false },
} satisfies ToolExample<Input, Output>;
export const mobilityTrialUnfinishedBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/mobility-trial-unfinished-bound",
    title: "Mobility Trial Unfinished Bound Tool",
    description:
      "Preserve an unfinished research trial as right-censored; the unused upper value is a supplied recording limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        completed: { type: "boolean" },
        completionLimit: { type: "number" },
      },
      required: ["elapsed", "completed", "completionLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationLower: { type: "number" },
        durationUpper: { type: "number" },
        upperKnown: { type: "boolean" },
      },
      required: ["durationLower", "durationUpper", "upperKnown"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "completionLimit",
          label: "Completion Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationLower",
          label: "Duration Lower",
          valueType: { type: "number" },
        },
        {
          id: "durationUpper",
          label: "Duration Upper",
          valueType: { type: "number" },
        },
        {
          id: "upperKnown",
          label: "Upper Known",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = mobilityTrialUnfinishedBoundTool.execute;
export default mobilityTrialUnfinishedBoundTool;
