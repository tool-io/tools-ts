import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledMinutes: number;
  readonly lateMinutes: number;
  readonly earlyDepartureMinutes: number;
  readonly interruptionMinutes: number;
  readonly refundedMinutes: number;
};
export type Output = {
  readonly attendedMinutes: number;
  readonly billableMinutes: number;
  readonly attendanceFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledMinutes: { type: "number", exclusiveMinimum: 0 },
    lateMinutes: { type: "number", minimum: 0 },
    earlyDepartureMinutes: { type: "number", minimum: 0 },
    interruptionMinutes: { type: "number", minimum: 0 },
    refundedMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "scheduledMinutes",
    "lateMinutes",
    "earlyDepartureMinutes",
    "interruptionMinutes",
    "refundedMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendedMinutes: { type: "number" },
    billableMinutes: { type: "number" },
    attendanceFraction: { type: "number" },
  },
  required: ["attendedMinutes", "billableMinutes", "attendanceFraction"],
} as const;
/** Explicit session attendance and refund-minute ledger; no treatment adequacy or billing entitlement rule is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    scheduledMinutes,
    lateMinutes,
    earlyDepartureMinutes,
    interruptionMinutes,
    refundedMinutes,
  } = request;
  const compute = (): Output => {
    H.positive(scheduledMinutes);
    H.domain(
      lateMinutes >= 0 &&
        earlyDepartureMinutes >= 0 &&
        interruptionMinutes >= 0 &&
        refundedMinutes >= 0 &&
        lateMinutes + earlyDepartureMinutes + interruptionMinutes <=
          scheduledMinutes,
    );
    return {
      attendedMinutes:
        scheduledMinutes -
        lateMinutes -
        earlyDepartureMinutes -
        interruptionMinutes,
      billableMinutes: Math.max(
        0,
        scheduledMinutes -
          lateMinutes -
          earlyDepartureMinutes -
          interruptionMinutes -
          refundedMinutes,
      ),
      attendanceFraction:
        (scheduledMinutes -
          lateMinutes -
          earlyDepartureMinutes -
          interruptionMinutes) /
        scheduledMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledMinutes: 60,
    lateMinutes: 5,
    earlyDepartureMinutes: 5,
    interruptionMinutes: 10,
    refundedMinutes: 5,
  },
  output: {
    attendedMinutes: 40,
    billableMinutes: 35,
    attendanceFraction: 0.6666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const therapySessionAttendedNetMinutesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/therapy-session-attended-net-minutes",
    title: "Therapy Session Attended Net Minutes Tool",
    description:
      "Explicit session attendance and refund-minute ledger; no treatment adequacy or billing entitlement rule is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledMinutes: { type: "number", exclusiveMinimum: 0 },
        lateMinutes: { type: "number", minimum: 0 },
        earlyDepartureMinutes: { type: "number", minimum: 0 },
        interruptionMinutes: { type: "number", minimum: 0 },
        refundedMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "scheduledMinutes",
        "lateMinutes",
        "earlyDepartureMinutes",
        "interruptionMinutes",
        "refundedMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attendedMinutes: { type: "number" },
        billableMinutes: { type: "number" },
        attendanceFraction: { type: "number" },
      },
      required: ["attendedMinutes", "billableMinutes", "attendanceFraction"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledMinutes",
          label: "Scheduled Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "lateMinutes",
          label: "Late Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "earlyDepartureMinutes",
          label: "Early Departure Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "interruptionMinutes",
          label: "Interruption Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "refundedMinutes",
          label: "Refunded Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "attendedMinutes",
          label: "Attended Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "billableMinutes",
          label: "Billable Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "attendanceFraction",
          label: "Attendance Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = therapySessionAttendedNetMinutesTool.execute;
export default therapySessionAttendedNetMinutesTool;
