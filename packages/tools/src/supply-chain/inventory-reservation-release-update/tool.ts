import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onHand: number;
  readonly reserved: number;
  readonly release: number;
  readonly newReservation: number;
};
export type Output = {
  readonly nextReserved: number;
  readonly available: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onHand: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    release: { type: "integer", minimum: 0 },
    newReservation: { type: "integer", minimum: 0 },
  },
  required: ["onHand", "reserved", "release", "newReservation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextReserved: { type: "integer" },
    available: { type: "integer" },
  },
  required: ["nextReserved", "available"],
} as const;
/** Calculate inventory reservation release update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onHand, reserved, release, newReservation } = request;
  const compute = (): Output => {
    H.integer(onHand, 0);
    H.integer(reserved, 0, onHand);
    H.integer(release, 0, reserved);
    H.integer(newReservation, 0, onHand - reserved + release);
    return {
      nextReserved: reserved - release + newReservation,
      available: onHand - reserved + release - newReservation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onHand: 100, reserved: 40, release: 10, newReservation: 20 },
  output: { nextReserved: 50, available: 50 },
} satisfies ToolExample<Input, Output>;
export const inventoryReservationReleaseUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/inventory-reservation-release-update",
    title: "Inventory Reservation Release Update Tool",
    description:
      "Calculate inventory reservation release update from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onHand: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
        release: { type: "integer", minimum: 0 },
        newReservation: { type: "integer", minimum: 0 },
      },
      required: ["onHand", "reserved", "release", "newReservation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextReserved: { type: "integer" },
        available: { type: "integer" },
      },
      required: ["nextReserved", "available"],
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
          id: "release",
          label: "Release",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newReservation",
          label: "New Reservation",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextReserved",
          label: "Next Reserved",
          valueType: { type: "integer" },
        },
        { id: "available", label: "Available", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = inventoryReservationReleaseUpdateTool.execute;
export default inventoryReservationReleaseUpdateTool;
