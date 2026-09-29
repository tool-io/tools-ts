import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slotEnd: number;
  readonly bookingEnd: number;
  readonly requiredBuffer: number;
};
export type Output = { readonly available: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slotEnd: { type: "number" },
    bookingEnd: { type: "number" },
    requiredBuffer: { type: "number", minimum: 0 },
  },
  required: ["slotEnd", "bookingEnd", "requiredBuffer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "number" }, slack: { type: "number" } },
  required: ["available", "slack"],
} as const;
/** Calculate booking slot end buffer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slotEnd, bookingEnd, requiredBuffer } = request;
  const compute = (): Output => {
    H.domain(requiredBuffer >= 0);
    return {
      available: slotEnd - bookingEnd,
      slack: slotEnd - bookingEnd - requiredBuffer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slotEnd: 60, bookingEnd: 50, requiredBuffer: 5 },
  output: { available: 10, slack: 5 },
} satisfies ToolExample<Input, Output>;
export const bookingSlotEndBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/booking-slot-end-buffer",
    title: "Booking Slot End Buffer Tool",
    description:
      "Calculate booking slot end buffer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slotEnd: { type: "number" },
        bookingEnd: { type: "number" },
        requiredBuffer: { type: "number", minimum: 0 },
      },
      required: ["slotEnd", "bookingEnd", "requiredBuffer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { available: { type: "number" }, slack: { type: "number" } },
      required: ["available", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "slotEnd",
          label: "Slot End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bookingEnd",
          label: "Booking End",
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
        { id: "available", label: "Available", valueType: { type: "number" } },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bookingSlotEndBufferTool.execute;
export default bookingSlotEndBufferTool;
