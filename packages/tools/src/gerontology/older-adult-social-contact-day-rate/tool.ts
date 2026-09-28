import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactEvents: number;
  readonly observedDays: number;
  readonly contactDays: number;
};
export type Output = {
  readonly eventsPerDay: number;
  readonly contactDayFraction: number;
  readonly eventsPerContactDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactEvents: { type: "integer" },
    observedDays: { type: "number", exclusiveMinimum: 0 },
    contactDays: { type: "integer", minimum: 1 },
  },
  required: ["contactEvents", "observedDays", "contactDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventsPerDay: { type: "number" },
    contactDayFraction: { type: "number" },
    eventsPerContactDay: { type: "number" },
  },
  required: ["eventsPerDay", "contactDayFraction", "eventsPerContactDay"],
} as const;
/** Descriptive diary contact frequency; no social isolation threshold or well-being assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactEvents, observedDays, contactDays } = request;
  const compute = (): Output => {
    H.positive(observedDays);
    H.integer(contactDays, 1, observedDays);
    H.integer(contactEvents, contactDays);
    return {
      eventsPerDay: contactEvents / observedDays,
      contactDayFraction: contactDays / observedDays,
      eventsPerContactDay: contactEvents / contactDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactEvents: 20, observedDays: 10, contactDays: 5 },
  output: { eventsPerDay: 2, contactDayFraction: 0.5, eventsPerContactDay: 4 },
} satisfies ToolExample<Input, Output>;
export const olderAdultSocialContactDayRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/older-adult-social-contact-day-rate",
    title: "Older Adult Social Contact Day Rate Tool",
    description:
      "Descriptive diary contact frequency; no social isolation threshold or well-being assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactEvents: { type: "integer" },
        observedDays: { type: "number", exclusiveMinimum: 0 },
        contactDays: { type: "integer", minimum: 1 },
      },
      required: ["contactEvents", "observedDays", "contactDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventsPerDay: { type: "number" },
        contactDayFraction: { type: "number" },
        eventsPerContactDay: { type: "number" },
      },
      required: ["eventsPerDay", "contactDayFraction", "eventsPerContactDay"],
    },
    ports: {
      inputs: [
        {
          id: "contactEvents",
          label: "Contact Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedDays",
          label: "Observed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactDays",
          label: "Contact Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "eventsPerDay",
          label: "Events Per Day",
          valueType: { type: "number" },
        },
        {
          id: "contactDayFraction",
          label: "Contact Day Fraction",
          valueType: { type: "number" },
        },
        {
          id: "eventsPerContactDay",
          label: "Events Per Contact Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = olderAdultSocialContactDayRateTool.execute;
export default olderAdultSocialContactDayRateTool;
