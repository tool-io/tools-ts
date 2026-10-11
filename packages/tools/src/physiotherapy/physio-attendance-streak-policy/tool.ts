import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: readonly boolean[];
  readonly attended: readonly boolean[];
  readonly unscheduledBreaksStreak: boolean;
};
export type Output = { readonly currentStreak: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "array", maxItems: 256, items: { type: "boolean" } },
    attended: { type: "array", maxItems: 256, items: { type: "boolean" } },
    unscheduledBreaksStreak: { type: "boolean" },
  },
  required: ["scheduled", "attended", "unscheduledBreaksStreak"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { currentStreak: { type: "integer" } },
  required: ["currentStreak"],
} as const;
/** Count a trailing attendance streak under an explicit unscheduled-day policy without interpreting adherence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, attended, unscheduledBreaksStreak } = request;
  const compute = (): Output => {
    H.domain(scheduled.length === attended.length, "attended");
    let currentStreak = 0;
    for (let i = 0; i < scheduled.length; i++) {
      if (scheduled[i]) currentStreak = attended[i] ? currentStreak + 1 : 0;
      else if (unscheduledBreaksStreak) currentStreak = 0;
    }
    return { currentStreak };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduled: [true, true, false, true],
    attended: [true, true, false, true],
    unscheduledBreaksStreak: false,
  },
  output: { currentStreak: 3 },
} satisfies ToolExample<Input, Output>;
export const physioAttendanceStreakPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/physio-attendance-streak-policy",
    title: "Physio Attendance Streak Policy",
    description:
      "Count a trailing attendance streak under an explicit unscheduled-day policy without interpreting adherence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduled: { type: "array", maxItems: 256, items: { type: "boolean" } },
        attended: { type: "array", maxItems: 256, items: { type: "boolean" } },
        unscheduledBreaksStreak: { type: "boolean" },
      },
      required: ["scheduled", "attended", "unscheduledBreaksStreak"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { currentStreak: { type: "integer" } },
      required: ["currentStreak"],
    },
    ports: {
      inputs: [
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "attended",
          label: "Attended",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "unscheduledBreaksStreak",
          label: "Unscheduled Breaks Streak",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "currentStreak",
          label: "Current Streak",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = physioAttendanceStreakPolicyTool.execute;
export default physioAttendanceStreakPolicyTool;
