import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invited: number;
  readonly attended: number;
  readonly ineligible: number;
  readonly undeliverable: number;
  readonly removeUndeliverable: boolean;
};
export type Output = {
  readonly eligibleInvitations: number;
  readonly attendanceFraction: number;
  readonly excluded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invited: { type: "integer", minimum: 1 },
    attended: { type: "integer", minimum: 0 },
    ineligible: { type: "integer", minimum: 0 },
    undeliverable: { type: "integer", minimum: 0 },
    removeUndeliverable: { type: "boolean" },
  },
  required: [
    "invited",
    "attended",
    "ineligible",
    "undeliverable",
    "removeUndeliverable",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleInvitations: { type: "integer" },
    attendanceFraction: { type: "number" },
    excluded: { type: "integer" },
  },
  required: ["eligibleInvitations", "attendanceFraction", "excluded"],
} as const;
/** Calculate vaccination invitation attendance denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invited, attended, ineligible, undeliverable, removeUndeliverable } =
    request;
  const compute = (): Output => {
    H.integer(invited, 1);
    H.integer(attended, 0);
    H.integer(ineligible, 0);
    H.integer(undeliverable, 0);
    H.domain(
      invited > ineligible + undeliverable &&
        attended <= invited - ineligible - undeliverable,
    );
    return {
      eligibleInvitations:
        invited - ineligible - (removeUndeliverable ? undeliverable : 0),
      attendanceFraction:
        attended /
        (invited - ineligible - (removeUndeliverable ? undeliverable : 0)),
      excluded: ineligible + (removeUndeliverable ? undeliverable : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invited: 100,
    attended: 60,
    ineligible: 10,
    undeliverable: 5,
    removeUndeliverable: true,
  },
  output: {
    eligibleInvitations: 85,
    attendanceFraction: 0.7058823529411765,
    excluded: 15,
  },
} satisfies ToolExample<Input, Output>;
export const vaccinationInvitationAttendanceDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/vaccination-invitation-attendance-denominator",
      title: "Vaccination Invitation Attendance Denominator Tool",
      description:
        "Calculate vaccination invitation attendance denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          invited: { type: "integer", minimum: 1 },
          attended: { type: "integer", minimum: 0 },
          ineligible: { type: "integer", minimum: 0 },
          undeliverable: { type: "integer", minimum: 0 },
          removeUndeliverable: { type: "boolean" },
        },
        required: [
          "invited",
          "attended",
          "ineligible",
          "undeliverable",
          "removeUndeliverable",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleInvitations: { type: "integer" },
          attendanceFraction: { type: "number" },
          excluded: { type: "integer" },
        },
        required: ["eligibleInvitations", "attendanceFraction", "excluded"],
      },
      ports: {
        inputs: [
          {
            id: "invited",
            label: "Invited",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "attended",
            label: "Attended",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "ineligible",
            label: "Ineligible",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "undeliverable",
            label: "Undeliverable",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "removeUndeliverable",
            label: "Remove Undeliverable",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "eligibleInvitations",
            label: "Eligible Invitations",
            valueType: { type: "integer" },
          },
          {
            id: "attendanceFraction",
            label: "Attendance Fraction",
            valueType: { type: "number" },
          },
          { id: "excluded", label: "Excluded", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = vaccinationInvitationAttendanceDenominatorTool.execute;
export default vaccinationInvitationAttendanceDenominatorTool;
