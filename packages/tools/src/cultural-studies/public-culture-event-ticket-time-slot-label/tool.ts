import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ticketId: string;
  readonly eventId: string;
  readonly suppliedTimeSlot: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ticketId: { type: "string", maxLength: 8192, minLength: 1 },
    eventId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTimeSlot: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ticketId", "eventId", "suppliedTimeSlot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit public-event ticket time-slot label without validating admission or local time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ticketId, eventId, suppliedTimeSlot } = request;
  const compute = (): Output => {
    H.domain(ticketId.length > 0, "ticketId");
    H.domain(eventId.length > 0, "eventId");
    H.domain(suppliedTimeSlot.length > 0, "suppliedTimeSlot");
    return { token: JSON.stringify([ticketId, eventId, suppliedTimeSlot]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ticketId: "T17", eventId: "EV2", suppliedTimeSlot: "14:00-15:00" },
  output: { token: '["T17","EV2","14:00-15:00"]' },
} satisfies ToolExample<Input, Output>;
export const publicCultureEventTicketTimeSlotLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cultural-studies", "cultural studies", "humanities"],
        keywords: ["cultural studies", "humanities"],
      },
      id: "cultural-studies/public-culture-event-ticket-time-slot-label",
      title: "Public Culture Event Ticket Time Slot Label",
      description:
        "Qualify an explicit public-event ticket time-slot label without validating admission or local time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ticketId: { type: "string", maxLength: 8192, minLength: 1 },
          eventId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTimeSlot: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["ticketId", "eventId", "suppliedTimeSlot"],
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
            id: "ticketId",
            label: "Ticket Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "eventId",
            label: "Event Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTimeSlot",
            label: "Supplied Time Slot",
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
export const run = publicCultureEventTicketTimeSlotLabelTool.execute;
export default publicCultureEventTicketTimeSlotLabelTool;
