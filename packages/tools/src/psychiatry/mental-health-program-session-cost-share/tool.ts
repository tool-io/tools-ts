import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fixedProgramCost: number;
  readonly sessionCount: number;
  readonly attendeesPerSession: number;
  readonly facilitatorCostPerSession: number;
  readonly subsidyFraction: number;
};
export type Output = {
  readonly totalCost: number;
  readonly grossPerAttendance: number;
  readonly netPerAttendance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedProgramCost: { type: "number", minimum: 0 },
    sessionCount: { type: "integer", minimum: 1 },
    attendeesPerSession: { type: "number", exclusiveMinimum: 0 },
    facilitatorCostPerSession: { type: "number", minimum: 0 },
    subsidyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "fixedProgramCost",
    "sessionCount",
    "attendeesPerSession",
    "facilitatorCostPerSession",
    "subsidyFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCost: { type: "number" },
    grossPerAttendance: { type: "number" },
    netPerAttendance: { type: "number" },
  },
  required: ["totalCost", "grossPerAttendance", "netPerAttendance"],
} as const;
/** Supplied group-session budget allocation per attendance, without program-effectiveness or coverage decisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    fixedProgramCost,
    sessionCount,
    attendeesPerSession,
    facilitatorCostPerSession,
    subsidyFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      fixedProgramCost >= 0 &&
        attendeesPerSession > 0 &&
        facilitatorCostPerSession >= 0,
    );
    H.integer(sessionCount, 1);
    H.probability(subsidyFraction);
    return {
      totalCost: fixedProgramCost + sessionCount * facilitatorCostPerSession,
      grossPerAttendance:
        (fixedProgramCost + sessionCount * facilitatorCostPerSession) /
        (sessionCount * attendeesPerSession),
      netPerAttendance:
        ((fixedProgramCost + sessionCount * facilitatorCostPerSession) *
          (1 - subsidyFraction)) /
        (sessionCount * attendeesPerSession),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fixedProgramCost: 1000,
    sessionCount: 10,
    attendeesPerSession: 20,
    facilitatorCostPerSession: 100,
    subsidyFraction: 0.5,
  },
  output: { totalCost: 2000, grossPerAttendance: 10, netPerAttendance: 5 },
} satisfies ToolExample<Input, Output>;
export const mentalHealthProgramSessionCostShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "psychiatry/mental-health-program-session-cost-share",
      title: "Mental Health Program Session Cost Share Tool",
      description:
        "Supplied group-session budget allocation per attendance, without program-effectiveness or coverage decisions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fixedProgramCost: { type: "number", minimum: 0 },
          sessionCount: { type: "integer", minimum: 1 },
          attendeesPerSession: { type: "number", exclusiveMinimum: 0 },
          facilitatorCostPerSession: { type: "number", minimum: 0 },
          subsidyFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "fixedProgramCost",
          "sessionCount",
          "attendeesPerSession",
          "facilitatorCostPerSession",
          "subsidyFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalCost: { type: "number" },
          grossPerAttendance: { type: "number" },
          netPerAttendance: { type: "number" },
        },
        required: ["totalCost", "grossPerAttendance", "netPerAttendance"],
      },
      ports: {
        inputs: [
          {
            id: "fixedProgramCost",
            label: "Fixed Program Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sessionCount",
            label: "Session Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "attendeesPerSession",
            label: "Attendees Per Session",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "facilitatorCostPerSession",
            label: "Facilitator Cost Per Session",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "subsidyFraction",
            label: "Subsidy Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalCost",
            label: "Total Cost",
            valueType: { type: "number" },
          },
          {
            id: "grossPerAttendance",
            label: "Gross Per Attendance",
            valueType: { type: "number" },
          },
          {
            id: "netPerAttendance",
            label: "Net Per Attendance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mentalHealthProgramSessionCostShareTool.execute;
export default mentalHealthProgramSessionCostShareTool;
