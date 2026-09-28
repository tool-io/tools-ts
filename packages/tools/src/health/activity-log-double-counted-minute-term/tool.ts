import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMinutes: number;
  readonly secondMinutes: number;
  readonly overlapMinutes: number;
};
export type Output = {
  readonly uniqueMinutes: number;
  readonly countedTwice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMinutes: { type: "number", minimum: 0 },
    secondMinutes: { type: "number", minimum: 0 },
    overlapMinutes: { type: "number", minimum: 0 },
  },
  required: ["firstMinutes", "secondMinutes", "overlapMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueMinutes: { type: "number" },
    countedTwice: { type: "number" },
  },
  required: ["uniqueMinutes", "countedTwice"],
} as const;
/** Reconcile supplied activity-log durations without an exercise or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMinutes, secondMinutes, overlapMinutes } = request;
  const compute = (): Output => {
    H.domain(
      firstMinutes >= 0 &&
        secondMinutes >= 0 &&
        overlapMinutes >= 0 &&
        overlapMinutes <= Math.min(firstMinutes, secondMinutes),
    );
    return {
      uniqueMinutes: firstMinutes + secondMinutes - overlapMinutes,
      countedTwice: overlapMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstMinutes: 30, secondMinutes: 40, overlapMinutes: 10 },
  output: { uniqueMinutes: 60, countedTwice: 10 },
} satisfies ToolExample<Input, Output>;
export const activityLogDoubleCountedMinuteTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/activity-log-double-counted-minute-term",
    title: "Activity Log Double Counted Minute Term Tool",
    description:
      "Reconcile supplied activity-log durations without an exercise or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMinutes: { type: "number", minimum: 0 },
        secondMinutes: { type: "number", minimum: 0 },
        overlapMinutes: { type: "number", minimum: 0 },
      },
      required: ["firstMinutes", "secondMinutes", "overlapMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueMinutes: { type: "number" },
        countedTwice: { type: "number" },
      },
      required: ["uniqueMinutes", "countedTwice"],
    },
    ports: {
      inputs: [
        {
          id: "firstMinutes",
          label: "First Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMinutes",
          label: "Second Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapMinutes",
          label: "Overlap Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueMinutes",
          label: "Unique Minutes",
          valueType: { type: "number" },
        },
        {
          id: "countedTwice",
          label: "Counted Twice",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = activityLogDoubleCountedMinuteTermTool.execute;
export default activityLogDoubleCountedMinuteTermTool;
