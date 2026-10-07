import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledDays: readonly boolean[];
  readonly completedDays: readonly boolean[];
  readonly countUnscheduled: boolean;
};
export type Output = {
  readonly denominatorDays: number;
  readonly completedCount: number;
  readonly completionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledDays: { type: "array", maxItems: 256, items: { type: "boolean" } },
    completedDays: { type: "array", maxItems: 256, items: { type: "boolean" } },
    countUnscheduled: { type: "boolean" },
  },
  required: ["scheduledDays", "completedDays", "countUnscheduled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorDays: { type: "integer" },
    completedCount: { type: "integer" },
    completionFraction: { type: "number" },
  },
  required: ["denominatorDays", "completedCount", "completionFraction"],
} as const;
/** Calculate recorded habit completion using an explicit policy for whether unscheduled days enter the denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledDays, completedDays, countUnscheduled } = request;
  const compute = (): Output => {
    H.domain(scheduledDays.length === completedDays.length, "completedDays");
    const included = scheduledDays.map((v) => countUnscheduled || v),
      denominatorDays = included.filter(Boolean).length;
    H.domain(denominatorDays > 0, "scheduledDays");
    const completedCount = completedDays.filter(
      (v, i) => v && included[i],
    ).length;
    return {
      denominatorDays,
      completedCount,
      completionFraction: completedCount / denominatorDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledDays: [true, false, true],
    completedDays: [true, false, false],
    countUnscheduled: false,
  },
  output: { denominatorDays: 2, completedCount: 1, completionFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const habitSkippeddayPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/habit-skipped-day-policy",
    title: "Habit Skipped Day Policy",
    description:
      "Calculate recorded habit completion using an explicit policy for whether unscheduled days enter the denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledDays: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        completedDays: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        countUnscheduled: { type: "boolean" },
      },
      required: ["scheduledDays", "completedDays", "countUnscheduled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorDays: { type: "integer" },
        completedCount: { type: "integer" },
        completionFraction: { type: "number" },
      },
      required: ["denominatorDays", "completedCount", "completionFraction"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledDays",
          label: "Scheduled Days",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "completedDays",
          label: "Completed Days",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "countUnscheduled",
          label: "Count Unscheduled",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorDays",
          label: "Denominator Days",
          valueType: { type: "integer" },
        },
        {
          id: "completedCount",
          label: "Completed Count",
          valueType: { type: "integer" },
        },
        {
          id: "completionFraction",
          label: "Completion Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habitSkippeddayPolicyTool.execute;
export default habitSkippeddayPolicyTool;
