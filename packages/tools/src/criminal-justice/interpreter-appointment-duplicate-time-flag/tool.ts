import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAppointmentTime: string;
  readonly secondAppointmentTime: string;
  readonly sameInterpreter: boolean;
};
export type Output = { readonly duplicateTime: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAppointmentTime: { type: "string", maxLength: 8192, minLength: 1 },
    secondAppointmentTime: { type: "string", maxLength: 8192, minLength: 1 },
    sameInterpreter: { type: "boolean" },
  },
  required: [
    "firstAppointmentTime",
    "secondAppointmentTime",
    "sameInterpreter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { duplicateTime: { type: "boolean" } },
  required: ["duplicateTime"],
} as const;
/** Flag exact identical supplied appointment time tokens for an explicitly shared interpreter without resolving time zones or interval overlap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAppointmentTime, secondAppointmentTime, sameInterpreter } =
    request;
  const compute = (): Output => {
    H.domain(firstAppointmentTime.length > 0, "firstAppointmentTime");
    H.domain(secondAppointmentTime.length > 0, "secondAppointmentTime");
    return {
      duplicateTime:
        sameInterpreter && firstAppointmentTime === secondAppointmentTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAppointmentTime: "2026-11-01 10:00",
    secondAppointmentTime: "2026-11-01 10:00",
    sameInterpreter: true,
  },
  output: { duplicateTime: true },
} satisfies ToolExample<Input, Output>;
export const interpreterAppointmentDuplicateTimeFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["criminal-justice", "criminal justice", "social sciences"],
        keywords: ["criminal justice", "social sciences"],
      },
      id: "criminal-justice/interpreter-appointment-duplicate-time-flag",
      title: "Interpreter Appointment Duplicate Time Flag",
      description:
        "Flag exact identical supplied appointment time tokens for an explicitly shared interpreter without resolving time zones or interval overlap.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstAppointmentTime: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          secondAppointmentTime: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          sameInterpreter: { type: "boolean" },
        },
        required: [
          "firstAppointmentTime",
          "secondAppointmentTime",
          "sameInterpreter",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { duplicateTime: { type: "boolean" } },
        required: ["duplicateTime"],
      },
      ports: {
        inputs: [
          {
            id: "firstAppointmentTime",
            label: "First Appointment Time",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondAppointmentTime",
            label: "Second Appointment Time",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sameInterpreter",
            label: "Same Interpreter",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "duplicateTime",
            label: "Duplicate Time",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = interpreterAppointmentDuplicateTimeFlagTool.execute;
export default interpreterAppointmentDuplicateTimeFlagTool;
