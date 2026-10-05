import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attendees: number;
  readonly invitedEligible: number;
};
export type Output = {
  readonly attendanceFraction: number;
  readonly nonattendingEligible: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendees: { type: "integer", minimum: 0 },
    invitedEligible: { type: "integer", minimum: 1 },
  },
  required: ["attendees", "invitedEligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendanceFraction: { type: "number" },
    nonattendingEligible: { type: "integer" },
  },
  required: ["attendanceFraction", "nonattendingEligible"],
} as const;
/** Compute attendance against an explicit invited-and-eligible denominator rather than an assumed population. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attendees, invitedEligible } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(invitedEligible) &&
        invitedEligible >= 1 &&
        invitedEligible <= Number.MAX_SAFE_INTEGER,
      "invitedEligible",
    ),
      invitedEligible);
    (H.domain(
      Number.isSafeInteger(attendees) &&
        attendees >= 0 &&
        attendees <= invitedEligible,
      "attendees",
    ),
      attendees);
    return {
      attendanceFraction: attendees / invitedEligible,
      nonattendingEligible: invitedEligible - attendees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attendees: 15, invitedEligible: 20 },
  output: { attendanceFraction: 0.75, nonattendingEligible: 5 },
} satisfies ToolExample<Input, Output>;
export const dialogueSessionAttendanceDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "peace-studies/dialogue-session-attendance-denominator",
      title: "Dialogue Session Attendance Denominator Tool",
      description:
        "Compute attendance against an explicit invited-and-eligible denominator rather than an assumed population.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attendees: { type: "integer", minimum: 0 },
          invitedEligible: { type: "integer", minimum: 1 },
        },
        required: ["attendees", "invitedEligible"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attendanceFraction: { type: "number" },
          nonattendingEligible: { type: "integer" },
        },
        required: ["attendanceFraction", "nonattendingEligible"],
      },
      ports: {
        inputs: [
          {
            id: "attendees",
            label: "Attendees",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "invitedEligible",
            label: "Invited Eligible",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "attendanceFraction",
            label: "Attendance Fraction",
            valueType: { type: "number" },
          },
          {
            id: "nonattendingEligible",
            label: "Nonattending Eligible",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dialogueSessionAttendanceDenominatorTool.execute;
export default dialogueSessionAttendanceDenominatorTool;
