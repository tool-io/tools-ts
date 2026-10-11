import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attendeeIds: readonly string[];
  readonly sessionIds: readonly string[];
};
export type Output = {
  readonly recordedAttendances: number;
  readonly distinctAttendees: number;
  readonly distinctSessions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendeeIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sessionIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["attendeeIds", "sessionIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAttendances: { type: "integer" },
    distinctAttendees: { type: "integer" },
    distinctSessions: { type: "integer" },
  },
  required: ["recordedAttendances", "distinctAttendees", "distinctSessions"],
} as const;
/** Count explicit attendance records, attendees, and sessions without estimating program reach or deduplicating attendance events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attendeeIds, sessionIds } = request;
  const compute = (): Output => {
    H.domain(attendeeIds.length === sessionIds.length, "sessionIds");
    H.domain(
      attendeeIds.every((x) => x.length > 0),
      "attendeeIds",
    );
    H.domain(
      sessionIds.every((x) => x.length > 0),
      "sessionIds",
    );
    return {
      recordedAttendances: attendeeIds.length,
      distinctAttendees: new Set(attendeeIds).size,
      distinctSessions: new Set(sessionIds).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attendeeIds: ["A", "A", "B"], sessionIds: ["S1", "S2", "S1"] },
  output: { recordedAttendances: 3, distinctAttendees: 2, distinctSessions: 2 },
} satisfies ToolExample<Input, Output>;
export const healthPromotionAttendeeSessionCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["public-health", "public health", "health and medicine"],
        keywords: ["public health", "health and medicine"],
      },
      id: "public-health/health-promotion-attendee-session-count",
      title: "Health Promotion Attendee Session Count",
      description:
        "Count explicit attendance records, attendees, and sessions without estimating program reach or deduplicating attendance events.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attendeeIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          sessionIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["attendeeIds", "sessionIds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedAttendances: { type: "integer" },
          distinctAttendees: { type: "integer" },
          distinctSessions: { type: "integer" },
        },
        required: [
          "recordedAttendances",
          "distinctAttendees",
          "distinctSessions",
        ],
      },
      ports: {
        inputs: [
          {
            id: "attendeeIds",
            label: "Attendee Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "sessionIds",
            label: "Session Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "recordedAttendances",
            label: "Recorded Attendances",
            valueType: { type: "integer" },
          },
          {
            id: "distinctAttendees",
            label: "Distinct Attendees",
            valueType: { type: "integer" },
          },
          {
            id: "distinctSessions",
            label: "Distinct Sessions",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthPromotionAttendeeSessionCountTool.execute;
export default healthPromotionAttendeeSessionCountTool;
