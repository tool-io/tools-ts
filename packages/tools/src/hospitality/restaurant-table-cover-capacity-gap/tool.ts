import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seatCapacity: number;
  readonly reservedCovers: number;
};
export type Output = {
  readonly availableSeats: number;
  readonly overbookedSeats: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatCapacity: { type: "integer", minimum: 0 },
    reservedCovers: { type: "integer", minimum: 0 },
  },
  required: ["seatCapacity", "reservedCovers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableSeats: { type: "integer" },
    overbookedSeats: { type: "integer" },
  },
  required: ["availableSeats", "overbookedSeats"],
} as const;
/** Compare simultaneously reserved restaurant covers with an explicit seating capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seatCapacity, reservedCovers } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(seatCapacity) &&
        seatCapacity >= 0 &&
        seatCapacity <= Number.MAX_SAFE_INTEGER,
      "seatCapacity",
    ),
      seatCapacity);
    (H.domain(
      Number.isSafeInteger(reservedCovers) &&
        reservedCovers >= 0 &&
        reservedCovers <= Number.MAX_SAFE_INTEGER,
      "reservedCovers",
    ),
      reservedCovers);
    return {
      availableSeats: Math.max(0, seatCapacity - reservedCovers),
      overbookedSeats: Math.max(0, reservedCovers - seatCapacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seatCapacity: 40, reservedCovers: 34 },
  output: { availableSeats: 6, overbookedSeats: 0 },
} satisfies ToolExample<Input, Output>;
export const restaurantTableCoverCapacityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/restaurant-table-cover-capacity-gap",
    title: "Restaurant Table Cover Capacity Gap Tool",
    description:
      "Compare simultaneously reserved restaurant covers with an explicit seating capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seatCapacity: { type: "integer", minimum: 0 },
        reservedCovers: { type: "integer", minimum: 0 },
      },
      required: ["seatCapacity", "reservedCovers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableSeats: { type: "integer" },
        overbookedSeats: { type: "integer" },
      },
      required: ["availableSeats", "overbookedSeats"],
    },
    ports: {
      inputs: [
        {
          id: "seatCapacity",
          label: "Seat Capacity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reservedCovers",
          label: "Reserved Covers",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "availableSeats",
          label: "Available Seats",
          valueType: { type: "integer" },
        },
        {
          id: "overbookedSeats",
          label: "Overbooked Seats",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = restaurantTableCoverCapacityGapTool.execute;
export default restaurantTableCoverCapacityGapTool;
