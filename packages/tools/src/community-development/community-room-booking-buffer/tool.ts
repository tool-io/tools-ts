import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousBookingEnd: number;
  readonly nextBookingStart: number;
  readonly requiredBuffer: number;
};
export type Output = {
  readonly availableBuffer: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousBookingEnd: { type: "number" },
    nextBookingStart: { type: "number" },
    requiredBuffer: { type: "number", minimum: 0 },
  },
  required: ["previousBookingEnd", "nextBookingStart", "requiredBuffer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableBuffer: { type: "number" },
    margin: { type: "number" },
  },
  required: ["availableBuffer", "margin"],
} as const;
/** Compare adjacent community-room bookings with an explicit required changeover duration on one common timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousBookingEnd, nextBookingStart, requiredBuffer } = request;
  const compute = (): Output => {
    H.domain(requiredBuffer >= 0, "requiredBuffer");
    return {
      availableBuffer: nextBookingStart - previousBookingEnd,
      margin: nextBookingStart - previousBookingEnd - requiredBuffer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousBookingEnd: 100, nextBookingStart: 120, requiredBuffer: 15 },
  output: { availableBuffer: 20, margin: 5 },
} satisfies ToolExample<Input, Output>;
export const communityRoomBookingBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/community-room-booking-buffer",
    title: "Community Room Booking Buffer",
    description:
      "Compare adjacent community-room bookings with an explicit required changeover duration on one common timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousBookingEnd: { type: "number" },
        nextBookingStart: { type: "number" },
        requiredBuffer: { type: "number", minimum: 0 },
      },
      required: ["previousBookingEnd", "nextBookingStart", "requiredBuffer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableBuffer: { type: "number" },
        margin: { type: "number" },
      },
      required: ["availableBuffer", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "previousBookingEnd",
          label: "Previous Booking End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextBookingStart",
          label: "Next Booking Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredBuffer",
          label: "Required Buffer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableBuffer",
          label: "Available Buffer",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = communityRoomBookingBufferTool.execute;
export default communityRoomBookingBufferTool;
