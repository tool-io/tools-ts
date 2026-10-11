import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bookingId: string;
  readonly localTimeText: string;
  readonly suppliedOffsetText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookingId: { type: "string", maxLength: 8192, minLength: 1 },
    localTimeText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedOffsetText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["bookingId", "localTimeText", "suppliedOffsetText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit travel-booking local-time and offset transcription without looking up time zones. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bookingId, localTimeText, suppliedOffsetText } = request;
  const compute = (): Output => {
    H.domain(bookingId.length > 0, "bookingId");
    H.domain(localTimeText.length > 0, "localTimeText");
    H.domain(suppliedOffsetText.length > 0, "suppliedOffsetText");
    return {
      token: JSON.stringify([bookingId, localTimeText, suppliedOffsetText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bookingId: "B17",
    localTimeText: "2026-11-01T10:00",
    suppliedOffsetText: "+01:00",
  },
  output: { token: '["B17","2026-11-01T10:00","+01:00"]' },
} satisfies ToolExample<Input, Output>;
export const travelBookingLocalTimeOffsetFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/travel-booking-local-time-offset-field",
    title: "Travel Booking Local Time Offset Field",
    description:
      "Preserve an explicit travel-booking local-time and offset transcription without looking up time zones.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookingId: { type: "string", maxLength: 8192, minLength: 1 },
        localTimeText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedOffsetText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["bookingId", "localTimeText", "suppliedOffsetText"],
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
          id: "bookingId",
          label: "Booking Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "localTimeText",
          label: "Local Time Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOffsetText",
          label: "Supplied Offset Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = travelBookingLocalTimeOffsetFieldTool.execute;
export default travelBookingLocalTimeOffsetFieldTool;
