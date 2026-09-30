import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessions: number;
  readonly seats: number;
  readonly reserved: number;
  readonly unavailable: number;
  readonly groupSize: number;
};
export type Output = {
  readonly availableSeats: number;
  readonly completeGroups: number;
  readonly leftoverSeats: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessions: { type: "integer", minimum: 0 },
    seats: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    unavailable: { type: "integer", minimum: 0 },
    groupSize: { type: "integer", minimum: 1 },
  },
  required: ["sessions", "seats", "reserved", "unavailable", "groupSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableSeats: { type: "integer" },
    completeGroups: { type: "integer" },
    leftoverSeats: { type: "integer" },
  },
  required: ["availableSeats", "completeGroups", "leftoverSeats"],
} as const;
/** Calculate maternity class seat session capacity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessions, seats, reserved, unavailable, groupSize } = request;
  const compute = (): Output => {
    H.integer(sessions, 0);
    H.integer(seats, 0);
    H.integer(reserved, 0);
    H.integer(unavailable, 0);
    H.integer(groupSize, 1);
    H.domain(reserved + unavailable <= sessions * seats);
    return {
      availableSeats: sessions * seats - reserved - unavailable,
      completeGroups: Math.floor(
        (sessions * seats - reserved - unavailable) / groupSize,
      ),
      leftoverSeats: (sessions * seats - reserved - unavailable) % groupSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessions: 4, seats: 10, reserved: 5, unavailable: 3, groupSize: 6 },
  output: { availableSeats: 32, completeGroups: 5, leftoverSeats: 2 },
} satisfies ToolExample<Input, Output>;
export const maternityClassSeatSessionCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/maternity-class-seat-session-capacity",
    title: "Maternity Class Seat Session Capacity Tool",
    description:
      "Calculate maternity class seat session capacity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessions: { type: "integer", minimum: 0 },
        seats: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
        unavailable: { type: "integer", minimum: 0 },
        groupSize: { type: "integer", minimum: 1 },
      },
      required: ["sessions", "seats", "reserved", "unavailable", "groupSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableSeats: { type: "integer" },
        completeGroups: { type: "integer" },
        leftoverSeats: { type: "integer" },
      },
      required: ["availableSeats", "completeGroups", "leftoverSeats"],
    },
    ports: {
      inputs: [
        {
          id: "sessions",
          label: "Sessions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seats",
          label: "Seats",
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
          id: "unavailable",
          label: "Unavailable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "groupSize",
          label: "Group Size",
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
          id: "completeGroups",
          label: "Complete Groups",
          valueType: { type: "integer" },
        },
        {
          id: "leftoverSeats",
          label: "Leftover Seats",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = maternityClassSeatSessionCapacityTool.execute;
export default maternityClassSeatSessionCapacityTool;
