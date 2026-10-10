import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly recordedEventCode: string;
  readonly eventDate: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedEventCode: { type: "string", maxLength: 8192, minLength: 1 },
    eventDate: { type: "string", maxLength: 8192 },
  },
  required: ["participantId", "recordedEventCode", "eventDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit oncology event code and date without adjudicating an outcome. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, recordedEventCode, eventDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(
      participantId.length > 0 && recordedEventCode.length > 0,
      "participantId",
    );
    namedDate(eventDate, "eventDate");
    return {
      token: JSON.stringify([participantId, recordedEventCode, eventDate]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    recordedEventCode: "EVENT-A",
    eventDate: "2026-11-01",
  },
  output: { token: '["P17","EVENT-A","2026-11-01"]' },
} satisfies ToolExample<Input, Output>;
export const oncologyOutcomeEventDateTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/oncology-outcome-event-date-token",
    title: "Oncology Outcome Event Date Token",
    description:
      "Record an explicit oncology event code and date without adjudicating an outcome.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedEventCode: { type: "string", maxLength: 8192, minLength: 1 },
        eventDate: { type: "string", maxLength: 8192 },
      },
      required: ["participantId", "recordedEventCode", "eventDate"],
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
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedEventCode",
          label: "Recorded Event Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventDate",
          label: "Event Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oncologyOutcomeEventDateTokenTool.execute;
export default oncologyOutcomeEventDateTokenTool;
