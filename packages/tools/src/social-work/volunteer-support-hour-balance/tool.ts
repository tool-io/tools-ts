import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredHours: number;
  readonly committedHours: number;
  readonly completedHours: number;
};
export type Output = {
  readonly uncommittedHours: number;
  readonly committedOutstandingHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredHours: { type: "number", minimum: 0 },
    committedHours: { type: "number", minimum: 0 },
    completedHours: { type: "number", minimum: 0 },
  },
  required: ["requiredHours", "committedHours", "completedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncommittedHours: { type: "number" },
    committedOutstandingHours: { type: "number" },
  },
  required: ["uncommittedHours", "committedOutstandingHours"],
} as const;
/** Balance required, total committed and completed volunteer support hours for a shared reporting period. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredHours, committedHours, completedHours } = request;
  const compute = (): Output => {
    H.domain(
      requiredHours >= 0 &&
        committedHours >= 0 &&
        completedHours >= 0 &&
        completedHours <= committedHours,
      "requiredHours",
    );
    return {
      uncommittedHours: Math.max(0, requiredHours - committedHours),
      committedOutstandingHours: committedHours - completedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredHours: 40, committedHours: 30, completedHours: 12 },
  output: { uncommittedHours: 10, committedOutstandingHours: 18 },
} satisfies ToolExample<Input, Output>;
export const volunteerSupportHourBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/volunteer-support-hour-balance",
    title: "Volunteer Support Hour Balance Tool",
    description:
      "Balance required, total committed and completed volunteer support hours for a shared reporting period.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredHours: { type: "number", minimum: 0 },
        committedHours: { type: "number", minimum: 0 },
        completedHours: { type: "number", minimum: 0 },
      },
      required: ["requiredHours", "committedHours", "completedHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncommittedHours: { type: "number" },
        committedOutstandingHours: { type: "number" },
      },
      required: ["uncommittedHours", "committedOutstandingHours"],
    },
    ports: {
      inputs: [
        {
          id: "requiredHours",
          label: "Required Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "committedHours",
          label: "Committed Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "completedHours",
          label: "Completed Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncommittedHours",
          label: "Uncommitted Hours",
          valueType: { type: "number" },
        },
        {
          id: "committedOutstandingHours",
          label: "Committed Outstanding Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = volunteerSupportHourBalanceTool.execute;
export default volunteerSupportHourBalanceTool;
