import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly roomCount: number; readonly nightCount: number };
export type Output = { readonly roomNights: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roomCount: { type: "integer", minimum: 0 },
    nightCount: { type: "integer", minimum: 0 },
  },
  required: ["roomCount", "nightCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { roomNights: { type: "integer" } },
  required: ["roomNights"],
} as const;
/** Count booked room-nights for a constant number of rooms over an explicit number of nights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roomCount, nightCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(roomCount) &&
        roomCount >= 0 &&
        roomCount <= Number.MAX_SAFE_INTEGER,
      "roomCount",
    ),
      roomCount);
    (H.domain(
      Number.isSafeInteger(nightCount) &&
        nightCount >= 0 &&
        nightCount <= Number.MAX_SAFE_INTEGER,
      "nightCount",
    ),
      nightCount);
    return { roomNights: roomCount * nightCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roomCount: 12, nightCount: 3 },
  output: { roomNights: 36 },
} satisfies ToolExample<Input, Output>;
export const hotelRoomNightBookingCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/hotel-room-night-booking-count",
    title: "Hotel Room Night Booking Count Tool",
    description:
      "Count booked room-nights for a constant number of rooms over an explicit number of nights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roomCount: { type: "integer", minimum: 0 },
        nightCount: { type: "integer", minimum: 0 },
      },
      required: ["roomCount", "nightCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { roomNights: { type: "integer" } },
      required: ["roomNights"],
    },
    ports: {
      inputs: [
        {
          id: "roomCount",
          label: "Room Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nightCount",
          label: "Night Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "roomNights",
          label: "Room Nights",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hotelRoomNightBookingCountTool.execute;
export default hotelRoomNightBookingCountTool;
