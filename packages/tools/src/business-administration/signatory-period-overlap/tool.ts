import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appointmentStart: number;
  readonly appointmentEnd: number;
  readonly authorizationStart: number;
  readonly authorizationEnd: number;
  readonly eventAt: number;
  readonly includeEnd: boolean;
};
export type Output = {
  readonly overlapDuration: number;
  readonly eventInBoth: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appointmentStart: { type: "number" },
    appointmentEnd: { type: "number" },
    authorizationStart: { type: "number" },
    authorizationEnd: { type: "number" },
    eventAt: { type: "number" },
    includeEnd: { type: "boolean" },
  },
  required: [
    "appointmentStart",
    "appointmentEnd",
    "authorizationStart",
    "authorizationEnd",
    "eventAt",
    "includeEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDuration: { type: "number" },
    eventInBoth: { type: "boolean" },
  },
  required: ["overlapDuration", "eventInBoth"],
} as const;
/** Inspect explicit appointment and authorization intervals only; no legal authority is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    appointmentStart,
    appointmentEnd,
    authorizationStart,
    authorizationEnd,
    eventAt,
    includeEnd,
  } = request;
  const compute = (): Output => {
    H.domain(
      appointmentEnd >= appointmentStart &&
        authorizationEnd >= authorizationStart,
    );
    return (() => {
      const a = Math.max(appointmentStart, authorizationStart),
        b = Math.min(appointmentEnd, authorizationEnd);
      return {
        overlapDuration: Math.max(0, b - a),
        eventInBoth: eventAt >= a && (includeEnd ? eventAt <= b : eventAt < b),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    appointmentStart: 0,
    appointmentEnd: 10,
    authorizationStart: 5,
    authorizationEnd: 15,
    eventAt: 7,
    includeEnd: false,
  },
  output: { overlapDuration: 5, eventInBoth: true },
} satisfies ToolExample<Input, Output>;
export const signatoryPeriodOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/signatory-period-overlap",
    title: "Signatory Period Overlap Tool",
    description:
      "Inspect explicit appointment and authorization intervals only; no legal authority is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appointmentStart: { type: "number" },
        appointmentEnd: { type: "number" },
        authorizationStart: { type: "number" },
        authorizationEnd: { type: "number" },
        eventAt: { type: "number" },
        includeEnd: { type: "boolean" },
      },
      required: [
        "appointmentStart",
        "appointmentEnd",
        "authorizationStart",
        "authorizationEnd",
        "eventAt",
        "includeEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDuration: { type: "number" },
        eventInBoth: { type: "boolean" },
      },
      required: ["overlapDuration", "eventInBoth"],
    },
    ports: {
      inputs: [
        {
          id: "appointmentStart",
          label: "Appointment Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "appointmentEnd",
          label: "Appointment End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "authorizationStart",
          label: "Authorization Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "authorizationEnd",
          label: "Authorization End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
        {
          id: "eventInBoth",
          label: "Event In Both",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = signatoryPeriodOverlapTool.execute;
export default signatoryPeriodOverlapTool;
