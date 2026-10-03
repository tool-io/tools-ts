import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onHand: number;
  readonly reserved: number;
  readonly cancelled: number;
  readonly fulfilled: number;
};
export type Output = {
  readonly remainingReserved: number;
  readonly available: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onHand: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    cancelled: { type: "integer", minimum: 0 },
    fulfilled: { type: "integer", minimum: 0 },
  },
  required: ["onHand", "reserved", "cancelled", "fulfilled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingReserved: { type: "integer" },
    available: { type: "integer" },
  },
  required: ["remainingReserved", "available"],
} as const;
/** Calculate stock reservation cancel release from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onHand, reserved, cancelled, fulfilled } = request;
  const compute = (): Output => {
    H.integer(onHand, 0);
    H.integer(reserved, 0, onHand);
    H.integer(cancelled, 0, reserved);
    H.integer(fulfilled, 0, reserved - cancelled);
    return {
      remainingReserved: reserved - cancelled - fulfilled,
      available: onHand - fulfilled - reserved + cancelled + fulfilled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onHand: 100, reserved: 40, cancelled: 10, fulfilled: 5 },
  output: { remainingReserved: 25, available: 70 },
} satisfies ToolExample<Input, Output>;
export const stockReservationCancelReleaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/stock-reservation-cancel-release",
    title: "Stock Reservation Cancel Release Tool",
    description:
      "Calculate stock reservation cancel release from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onHand: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
        cancelled: { type: "integer", minimum: 0 },
        fulfilled: { type: "integer", minimum: 0 },
      },
      required: ["onHand", "reserved", "cancelled", "fulfilled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingReserved: { type: "integer" },
        available: { type: "integer" },
      },
      required: ["remainingReserved", "available"],
    },
    ports: {
      inputs: [
        {
          id: "onHand",
          label: "On Hand",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cancelled",
          label: "Cancelled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fulfilled",
          label: "Fulfilled",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingReserved",
          label: "Remaining Reserved",
          valueType: { type: "integer" },
        },
        { id: "available", label: "Available", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = stockReservationCancelReleaseTool.execute;
export default stockReservationCancelReleaseTool;
