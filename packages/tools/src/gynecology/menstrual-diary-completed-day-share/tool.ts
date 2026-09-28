import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expected: number;
  readonly complete: number;
  readonly partial: number;
  readonly excluded: number;
  readonly countPartial: boolean;
};
export type Output = {
  readonly eligible: number;
  readonly counted: number;
  readonly completion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expected: { type: "integer", minimum: 1 },
    complete: { type: "integer", minimum: 0 },
    partial: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    countPartial: { type: "boolean" },
  },
  required: ["expected", "complete", "partial", "excluded", "countPartial"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    counted: { type: "integer" },
    completion: { type: "number" },
  },
  required: ["eligible", "counted", "completion"],
} as const;
/** Audit complete and partial diary days under an explicit inclusion policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expected, complete, partial, excluded, countPartial } = request;
  const compute = (): Output => {
    H.integer(expected, 1);
    H.integer(excluded, 0, expected - 1);
    H.integer(complete, 0);
    H.integer(partial, 0);
    H.domain(complete + partial <= expected - excluded, "partial");
    return {
      eligible: expected - excluded,
      counted: complete + (countPartial ? partial : 0),
      completion:
        (complete + (countPartial ? partial : 0)) / (expected - excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expected: 30,
    complete: 20,
    partial: 5,
    excluded: 2,
    countPartial: true,
  },
  output: { eligible: 28, counted: 25, completion: 0.8928571428571429 },
} satisfies ToolExample<Input, Output>;
export const menstrualDiaryCompletedDayShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/menstrual-diary-completed-day-share",
    title: "Menstrual Diary Completed Day Share Tool",
    description:
      "Audit complete and partial diary days under an explicit inclusion policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "integer", minimum: 1 },
        complete: { type: "integer", minimum: 0 },
        partial: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        countPartial: { type: "boolean" },
      },
      required: ["expected", "complete", "partial", "excluded", "countPartial"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer" },
        counted: { type: "integer" },
        completion: { type: "number" },
      },
      required: ["eligible", "counted", "completion"],
    },
    ports: {
      inputs: [
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "complete",
          label: "Complete",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "partial",
          label: "Partial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countPartial",
          label: "Count Partial",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
        { id: "counted", label: "Counted", valueType: { type: "integer" } },
        {
          id: "completion",
          label: "Completion",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = menstrualDiaryCompletedDayShareTool.execute;
export default menstrualDiaryCompletedDayShareTool;
