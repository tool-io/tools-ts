import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tripStart: number;
  readonly tripEnd: number;
  readonly ticketStart: number;
  readonly ticketEnd: number;
};
export type Output = { readonly overlapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tripStart: { type: "integer" },
    tripEnd: { type: "integer" },
    ticketStart: { type: "integer" },
    ticketEnd: { type: "integer" },
  },
  required: ["tripStart", "tripEnd", "ticketStart", "ticketEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapDays: { type: "integer" } },
  required: ["overlapDays"],
} as const;
/** Intersect supplied half-open absolute-day trip and ticket windows without inferring ticket terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tripStart, tripEnd, ticketStart, ticketEnd } = request;
  const compute = (): Output => {
    H.domain(tripStart <= tripEnd && ticketStart <= ticketEnd);
    return {
      overlapDays: Math.max(
        0,
        Math.min(tripEnd, ticketEnd) - Math.max(tripStart, ticketStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tripStart: 10, tripEnd: 20, ticketStart: 15, ticketEnd: 25 },
  output: { overlapDays: 5 },
} satisfies ToolExample<Input, Output>;
export const attractionTicketValidityOverlapDaysTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "tourism/attraction-ticket-validity-overlap-days",
      title: "Attraction Ticket Validity Overlap Days Tool",
      description:
        "Intersect supplied half-open absolute-day trip and ticket windows without inferring ticket terms.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tripStart: { type: "integer" },
          tripEnd: { type: "integer" },
          ticketStart: { type: "integer" },
          ticketEnd: { type: "integer" },
        },
        required: ["tripStart", "tripEnd", "ticketStart", "ticketEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { overlapDays: { type: "integer" } },
        required: ["overlapDays"],
      },
      ports: {
        inputs: [
          {
            id: "tripStart",
            label: "Trip Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "tripEnd",
            label: "Trip End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "ticketStart",
            label: "Ticket Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "ticketEnd",
            label: "Ticket End",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "overlapDays",
            label: "Overlap Days",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = attractionTicketValidityOverlapDaysTool.execute;
export default attractionTicketValidityOverlapDaysTool;
