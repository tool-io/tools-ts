import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly day: number;
  readonly previousEnd: number;
  readonly nextStart: number;
  readonly includePreviousEnd: boolean;
  readonly includeNextStart: boolean;
};
export type Output = { readonly inGap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    day: { type: "number" },
    previousEnd: { type: "number" },
    nextStart: { type: "number" },
    includePreviousEnd: { type: "boolean" },
    includeNextStart: { type: "boolean" },
  },
  required: [
    "day",
    "previousEnd",
    "nextStart",
    "includePreviousEnd",
    "includeNextStart",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inGap: { type: "boolean" } },
  required: ["inGap"],
} as const;
/** Classify a supplied diary gap with explicit endpoint conventions without predicting cycles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { day, previousEnd, nextStart, includePreviousEnd, includeNextStart } =
    request;
  const compute = (): Output => {
    H.domain(previousEnd <= nextStart);
    return {
      inGap:
        (includePreviousEnd ? day >= previousEnd : day > previousEnd) &&
        (includeNextStart ? day <= nextStart : day < nextStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    day: 10,
    previousEnd: 10,
    nextStart: 15,
    includePreviousEnd: true,
    includeNextStart: false,
  },
  output: { inGap: true },
} satisfies ToolExample<Input, Output>;
export const cycleDiaryGapClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/cycle-diary-gap-closure-token",
    title: "Cycle Diary Gap Closure Token Tool",
    description:
      "Classify a supplied diary gap with explicit endpoint conventions without predicting cycles.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        day: { type: "number" },
        previousEnd: { type: "number" },
        nextStart: { type: "number" },
        includePreviousEnd: { type: "boolean" },
        includeNextStart: { type: "boolean" },
      },
      required: [
        "day",
        "previousEnd",
        "nextStart",
        "includePreviousEnd",
        "includeNextStart",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inGap: { type: "boolean" } },
      required: ["inGap"],
    },
    ports: {
      inputs: [
        {
          id: "day",
          label: "Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includePreviousEnd",
          label: "Include Previous End",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeNextStart",
          label: "Include Next Start",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inGap", label: "In Gap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cycleDiaryGapClosureTokenTool.execute;
export default cycleDiaryGapClosureTokenTool;
