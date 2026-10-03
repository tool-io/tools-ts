import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessions: number;
  readonly seats: number;
  readonly staff: number;
  readonly staffMinutes: number;
  readonly minutesPerClient: number;
};
export type Output = {
  readonly seatCapacity: number;
  readonly staffCapacity: number;
  readonly effectiveCapacity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessions: { type: "integer", minimum: 0 },
    seats: { type: "integer", minimum: 0 },
    staff: { type: "integer", minimum: 0 },
    staffMinutes: { type: "number", minimum: 0 },
    minutesPerClient: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sessions", "seats", "staff", "staffMinutes", "minutesPerClient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatCapacity: { type: "integer" },
    staffCapacity: { type: "integer" },
    effectiveCapacity: { type: "integer" },
  },
  required: ["seatCapacity", "staffCapacity", "effectiveCapacity"],
} as const;
/** Calculate public health service capacity session term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessions, seats, staff, staffMinutes, minutesPerClient } = request;
  const compute = (): Output => {
    H.integer(sessions, 0);
    H.integer(seats, 0);
    H.integer(staff, 0);
    H.domain(staffMinutes >= 0);
    H.positive(minutesPerClient);
    return {
      seatCapacity: sessions * seats,
      staffCapacity: Math.floor((staff * staffMinutes) / minutesPerClient),
      effectiveCapacity: Math.min(
        sessions * seats,
        Math.floor((staff * staffMinutes) / minutesPerClient),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessions: 4,
    seats: 10,
    staff: 2,
    staffMinutes: 180,
    minutesPerClient: 15,
  },
  output: { seatCapacity: 40, staffCapacity: 24, effectiveCapacity: 24 },
} satisfies ToolExample<Input, Output>;
export const publicHealthServiceCapacitySessionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/public-health-service-capacity-session-term",
      title: "Public Health Service Capacity Session Term Tool",
      description:
        "Calculate public health service capacity session term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessions: { type: "integer", minimum: 0 },
          seats: { type: "integer", minimum: 0 },
          staff: { type: "integer", minimum: 0 },
          staffMinutes: { type: "number", minimum: 0 },
          minutesPerClient: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "sessions",
          "seats",
          "staff",
          "staffMinutes",
          "minutesPerClient",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seatCapacity: { type: "integer" },
          staffCapacity: { type: "integer" },
          effectiveCapacity: { type: "integer" },
        },
        required: ["seatCapacity", "staffCapacity", "effectiveCapacity"],
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
            id: "staff",
            label: "Staff",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "staffMinutes",
            label: "Staff Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minutesPerClient",
            label: "Minutes Per Client",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "seatCapacity",
            label: "Seat Capacity",
            valueType: { type: "integer" },
          },
          {
            id: "staffCapacity",
            label: "Staff Capacity",
            valueType: { type: "integer" },
          },
          {
            id: "effectiveCapacity",
            label: "Effective Capacity",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicHealthServiceCapacitySessionTermTool.execute;
export default publicHealthServiceCapacitySessionTermTool;
