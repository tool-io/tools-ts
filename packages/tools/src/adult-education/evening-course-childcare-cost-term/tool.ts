import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessions: number;
  readonly classHours: number;
  readonly travelHours: number;
  readonly hourlyRate: number;
  readonly minimumHours: number;
};
export type Output = {
  readonly billedHoursPerSession: number;
  readonly totalHours: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessions: { type: "integer", minimum: 0 },
    classHours: { type: "number", minimum: 0 },
    travelHours: { type: "number", minimum: 0 },
    hourlyRate: { type: "number", minimum: 0 },
    minimumHours: { type: "number", minimum: 0 },
  },
  required: [
    "sessions",
    "classHours",
    "travelHours",
    "hourlyRate",
    "minimumHours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billedHoursPerSession: { type: "number" },
    totalHours: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["billedHoursPerSession", "totalHours", "totalCost"],
} as const;
/** Calculate evening course childcare cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessions, classHours, travelHours, hourlyRate, minimumHours } =
    request;
  const compute = (): Output => {
    H.integer(sessions, 0);
    H.domain(
      classHours >= 0 &&
        travelHours >= 0 &&
        hourlyRate >= 0 &&
        minimumHours >= 0,
    );
    return {
      billedHoursPerSession: Math.max(minimumHours, classHours + travelHours),
      totalHours: sessions * Math.max(minimumHours, classHours + travelHours),
      totalCost:
        sessions *
        Math.max(minimumHours, classHours + travelHours) *
        hourlyRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessions: 10,
    classHours: 2,
    travelHours: 1,
    hourlyRate: 12,
    minimumHours: 2,
  },
  output: { billedHoursPerSession: 3, totalHours: 30, totalCost: 360 },
} satisfies ToolExample<Input, Output>;
export const eveningCourseChildcareCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/evening-course-childcare-cost-term",
    title: "Evening Course Childcare Cost Term Tool",
    description:
      "Calculate evening course childcare cost term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessions: { type: "integer", minimum: 0 },
        classHours: { type: "number", minimum: 0 },
        travelHours: { type: "number", minimum: 0 },
        hourlyRate: { type: "number", minimum: 0 },
        minimumHours: { type: "number", minimum: 0 },
      },
      required: [
        "sessions",
        "classHours",
        "travelHours",
        "hourlyRate",
        "minimumHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billedHoursPerSession: { type: "number" },
        totalHours: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["billedHoursPerSession", "totalHours", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "sessions",
          label: "Sessions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "classHours",
          label: "Class Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelHours",
          label: "Travel Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyRate",
          label: "Hourly Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumHours",
          label: "Minimum Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "billedHoursPerSession",
          label: "Billed Hours Per Session",
          valueType: { type: "number" },
        },
        {
          id: "totalHours",
          label: "Total Hours",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eveningCourseChildcareCostTermTool.execute;
export default eveningCourseChildcareCostTermTool;
