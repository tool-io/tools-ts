import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dueDay: number;
  readonly cutoffDay: number;
  readonly completed: boolean;
};
export type Output = { readonly overdueDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dueDay: { type: "number" },
    cutoffDay: { type: "number" },
    completed: { type: "boolean" },
  },
  required: ["dueDay", "cutoffDay", "completed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overdueDays: { type: "number" } },
  required: ["overdueDays"],
} as const;
/** Compute calendar-coordinate overdue span under an explicit completed flag; no business-day calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dueDay, cutoffDay, completed } = request;
  const compute = (): Output => {
    return { overdueDays: completed ? 0 : Math.max(0, cutoffDay - dueDay) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dueDay: 10, cutoffDay: 15, completed: false },
  output: { overdueDays: 5 },
} satisfies ToolExample<Input, Output>;
export const supportActionOverdueDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/support-action-overdue-days",
    title: "Support Action Overdue Days Tool",
    description:
      "Compute calendar-coordinate overdue span under an explicit completed flag; no business-day calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dueDay: { type: "number" },
        cutoffDay: { type: "number" },
        completed: { type: "boolean" },
      },
      required: ["dueDay", "cutoffDay", "completed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overdueDays: { type: "number" } },
      required: ["overdueDays"],
    },
    ports: {
      inputs: [
        {
          id: "dueDay",
          label: "Due Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoffDay",
          label: "Cutoff Day",
          required: true,
          valueType: { type: "number" },
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
          id: "overdueDays",
          label: "Overdue Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = supportActionOverdueDaysTool.execute;
export default supportActionOverdueDaysTool;
