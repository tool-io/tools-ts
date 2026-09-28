import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly suspension: number;
  readonly reportingLag: number;
};
export type Output = {
  readonly calendarDuration: number;
  readonly activeDuration: number;
  readonly totalToReport: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    suspension: { type: "number", minimum: 0 },
    reportingLag: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "suspension", "reportingLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarDuration: { type: "number" },
    activeDuration: { type: "number" },
    totalToReport: { type: "number" },
  },
  required: ["calendarDuration", "activeDuration", "totalToReport"],
} as const;
/** Calculate glp study phase duration clock pause from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, suspension, reportingLag } = request;
  const compute = (): Output => {
    H.domain(
      end >= start &&
        suspension >= 0 &&
        suspension <= end - start &&
        reportingLag >= 0,
    );
    return {
      calendarDuration: end - start,
      activeDuration: end - start - suspension,
      totalToReport: end - start + reportingLag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 100, end: 150, suspension: 10, reportingLag: 5 },
  output: { calendarDuration: 50, activeDuration: 40, totalToReport: 55 },
} satisfies ToolExample<Input, Output>;
export const glpStudyPhaseDurationClockPauseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-study-phase-duration-clock-pause",
    title: "GLP Study Phase Duration Clock Pause Tool",
    description:
      "Calculate glp study phase duration clock pause from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        suspension: { type: "number", minimum: 0 },
        reportingLag: { type: "number", minimum: 0 },
      },
      required: ["start", "end", "suspension", "reportingLag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarDuration: { type: "number" },
        activeDuration: { type: "number" },
        totalToReport: { type: "number" },
      },
      required: ["calendarDuration", "activeDuration", "totalToReport"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suspension",
          label: "Suspension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportingLag",
          label: "Reporting Lag",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calendarDuration",
          label: "Calendar Duration",
          valueType: { type: "number" },
        },
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
        {
          id: "totalToReport",
          label: "Total To Report",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = glpStudyPhaseDurationClockPauseTool.execute;
export default glpStudyPhaseDurationClockPauseTool;
