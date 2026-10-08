import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly attendeeId: string;
  readonly suppliedConsentCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    attendeeId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedConsentCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionId", "attendeeId", "suppliedConsentCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied restorative-session attendance consent metadata without establishing consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, attendeeId, suppliedConsentCode } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0, "sessionId");
    H.domain(attendeeId.length > 0, "attendeeId");
    H.domain(suppliedConsentCode.length > 0, "suppliedConsentCode");
    return {
      token: JSON.stringify([sessionId, attendeeId, suppliedConsentCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionId: "S17",
    attendeeId: "A4",
    suppliedConsentCode: "recorded",
  },
  output: { token: '["S17","A4","recorded"]' },
} satisfies ToolExample<Input, Output>;
export const restorativeSessionAttendanceConsentTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["criminal-justice", "criminal justice", "social sciences"],
        keywords: ["criminal justice", "social sciences"],
      },
      id: "criminal-justice/restorative-session-attendance-consent-token",
      title: "Restorative Session Attendance Consent Token",
      description:
        "Preserve explicitly supplied restorative-session attendance consent metadata without establishing consent validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionId: { type: "string", maxLength: 8192, minLength: 1 },
          attendeeId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedConsentCode: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["sessionId", "attendeeId", "suppliedConsentCode"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "sessionId",
            label: "Session Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "attendeeId",
            label: "Attendee Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedConsentCode",
            label: "Supplied Consent Code",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = restorativeSessionAttendanceConsentTokenTool.execute;
export default restorativeSessionAttendanceConsentTokenTool;
