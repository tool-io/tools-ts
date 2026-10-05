import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMinute: number;
  readonly endMinute: number;
  readonly simultaneousActivityCount: number;
};
export type Output = {
  readonly elapsedMinutes: number;
  readonly fractionalAllocatedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMinute: { type: "integer", minimum: 0 },
    endMinute: { type: "integer" },
    simultaneousActivityCount: { type: "integer", minimum: 1 },
  },
  required: ["startMinute", "endMinute", "simultaneousActivityCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedMinutes: { type: "integer" },
    fractionalAllocatedMinutes: { type: "number" },
  },
  required: ["elapsedMinutes", "fractionalAllocatedMinutes"],
} as const;
/** Measure a care-diary activity interval and its equal fractional time allocation across explicitly counted concurrent activities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMinute, endMinute, simultaneousActivityCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startMinute) &&
        startMinute >= 0 &&
        startMinute <= Number.MAX_SAFE_INTEGER,
      "startMinute",
    ),
      startMinute);
    (H.domain(
      Number.isSafeInteger(endMinute) &&
        endMinute >= startMinute &&
        endMinute <= Number.MAX_SAFE_INTEGER,
      "endMinute",
    ),
      endMinute);
    (H.domain(
      Number.isSafeInteger(simultaneousActivityCount) &&
        simultaneousActivityCount >= 1 &&
        simultaneousActivityCount <= Number.MAX_SAFE_INTEGER,
      "simultaneousActivityCount",
    ),
      simultaneousActivityCount);
    return {
      elapsedMinutes: endMinute - startMinute,
      fractionalAllocatedMinutes:
        (endMinute - startMinute) / simultaneousActivityCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMinute: 60, endMinute: 120, simultaneousActivityCount: 2 },
  output: { elapsedMinutes: 60, fractionalAllocatedMinutes: 30 },
} satisfies ToolExample<Input, Output>;
export const careDiaryActivityMinuteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/care-diary-activity-minute-count",
    title: "Care Diary Activity Minute Count Tool",
    description:
      "Measure a care-diary activity interval and its equal fractional time allocation across explicitly counted concurrent activities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMinute: { type: "integer", minimum: 0 },
        endMinute: { type: "integer" },
        simultaneousActivityCount: { type: "integer", minimum: 1 },
      },
      required: ["startMinute", "endMinute", "simultaneousActivityCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedMinutes: { type: "integer" },
        fractionalAllocatedMinutes: { type: "number" },
      },
      required: ["elapsedMinutes", "fractionalAllocatedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "startMinute",
          label: "Start Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endMinute",
          label: "End Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "simultaneousActivityCount",
          label: "Simultaneous Activity Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          valueType: { type: "integer" },
        },
        {
          id: "fractionalAllocatedMinutes",
          label: "Fractional Allocated Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = careDiaryActivityMinuteCountTool.execute;
export default careDiaryActivityMinuteCountTool;
