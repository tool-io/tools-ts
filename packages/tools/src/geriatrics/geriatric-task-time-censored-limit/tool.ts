import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSeconds: number;
  readonly limitSeconds: number;
  readonly completed: boolean;
};
export type Output = {
  readonly recordedSeconds: number;
  readonly rightCensored: boolean;
  readonly exceededLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSeconds: { type: "number", minimum: 0 },
    limitSeconds: { type: "number", exclusiveMinimum: 0 },
    completed: { type: "boolean" },
  },
  required: ["observedSeconds", "limitSeconds", "completed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSeconds: { type: "number" },
    rightCensored: { type: "boolean" },
    exceededLimit: { type: "boolean" },
  },
  required: ["recordedSeconds", "rightCensored", "exceededLimit"],
} as const;
/** Administrative time-limit recording for an observed task, not a performance or clinical classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedSeconds, limitSeconds, completed } = request;
  const compute = (): Output => {
    H.domain(observedSeconds >= 0);
    H.positive(limitSeconds);
    return {
      recordedSeconds: Math.min(observedSeconds, limitSeconds),
      rightCensored: !completed || observedSeconds > limitSeconds,
      exceededLimit: observedSeconds > limitSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedSeconds: 90, limitSeconds: 120, completed: false },
  output: { recordedSeconds: 90, rightCensored: true, exceededLimit: false },
} satisfies ToolExample<Input, Output>;
export const geriatricTaskTimeCensoredLimitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/geriatric-task-time-censored-limit",
    title: "Geriatric Task Time Censored Limit Tool",
    description:
      "Administrative time-limit recording for an observed task, not a performance or clinical classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedSeconds: { type: "number", minimum: 0 },
        limitSeconds: { type: "number", exclusiveMinimum: 0 },
        completed: { type: "boolean" },
      },
      required: ["observedSeconds", "limitSeconds", "completed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSeconds: { type: "number" },
        rightCensored: { type: "boolean" },
        exceededLimit: { type: "boolean" },
      },
      required: ["recordedSeconds", "rightCensored", "exceededLimit"],
    },
    ports: {
      inputs: [
        {
          id: "observedSeconds",
          label: "Observed Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "limitSeconds",
          label: "Limit Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recordedSeconds",
          label: "Recorded Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "rightCensored",
          label: "Right Censored",
          valueType: { type: "boolean" },
        },
        {
          id: "exceededLimit",
          label: "Exceeded Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = geriatricTaskTimeCensoredLimitTool.execute;
export default geriatricTaskTimeCensoredLimitTool;
