import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
  readonly period: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number", minimum: 0 },
    firstEnd: { type: "number" },
    secondStart: { type: "number", minimum: 0 },
    secondEnd: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Shortest separation of two closed non-wrapping supplied intervals on one periodic domain. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd, period } = request;
  const compute = (): Output => {
    H.positive(period);
    H.domain(
      firstStart >= 0 &&
        firstStart <= firstEnd &&
        firstEnd <= period &&
        secondStart >= 0 &&
        secondStart <= secondEnd &&
        secondEnd <= period,
    );
    const gap = (shift: number) =>
      Math.max(
        0,
        firstStart - (secondEnd + shift),
        secondStart + shift - firstEnd,
      );
    return { gap: Math.min(gap(0), gap(period), gap(-period)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStart: 1,
    firstEnd: 2,
    secondStart: 8,
    secondEnd: 9,
    period: 10,
  },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const periodicIntervalShorterGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/periodic-interval-shorter-gap",
    title: "Periodic Interval Shorter Gap Tool",
    description:
      "Shortest separation of two closed non-wrapping supplied intervals on one periodic domain.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "number", minimum: 0 },
        firstEnd: { type: "number" },
        secondStart: { type: "number", minimum: 0 },
        secondEnd: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstStart",
        "firstEnd",
        "secondStart",
        "secondEnd",
        "period",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = periodicIntervalShorterGapTool.execute;
export default periodicIntervalShorterGapTool;
