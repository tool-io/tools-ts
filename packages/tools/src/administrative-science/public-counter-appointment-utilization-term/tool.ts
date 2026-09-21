import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly booked: number;
  readonly attended: number;
  readonly slots: number;
  readonly blockedSlots: number;
};
export type Output = {
  readonly availableSlots: number;
  readonly bookingUtilization: number;
  readonly attendedUtilization: number;
  readonly noShowFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    booked: { type: "integer", minimum: 1 },
    attended: { type: "integer", minimum: 0 },
    slots: { type: "integer", minimum: 1 },
    blockedSlots: { type: "integer", minimum: 0 },
  },
  required: ["booked", "attended", "slots", "blockedSlots"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableSlots: { type: "integer" },
    bookingUtilization: { type: "number" },
    attendedUtilization: { type: "number" },
    noShowFraction: { type: "number" },
  },
  required: [
    "availableSlots",
    "bookingUtilization",
    "attendedUtilization",
    "noShowFraction",
  ],
} as const;
/** Calculate public counter appointment utilization term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { booked, attended, slots, blockedSlots } = request;
  const compute = (): Output => {
    H.integer(slots, 1);
    H.integer(blockedSlots, 0, slots - 1);
    H.integer(booked, 1, slots - blockedSlots);
    H.integer(attended, 0, booked);
    return {
      availableSlots: slots - blockedSlots,
      bookingUtilization: booked / (slots - blockedSlots),
      attendedUtilization: attended / (slots - blockedSlots),
      noShowFraction: (booked - attended) / booked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { booked: 80, attended: 60, slots: 100, blockedSlots: 10 },
  output: {
    availableSlots: 90,
    bookingUtilization: 0.8888888888888888,
    attendedUtilization: 0.6666666666666666,
    noShowFraction: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const publicCounterAppointmentUtilizationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "administrative-science/public-counter-appointment-utilization-term",
      title: "Public Counter Appointment Utilization Term Tool",
      description:
        "Calculate public counter appointment utilization term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          booked: { type: "integer", minimum: 1 },
          attended: { type: "integer", minimum: 0 },
          slots: { type: "integer", minimum: 1 },
          blockedSlots: { type: "integer", minimum: 0 },
        },
        required: ["booked", "attended", "slots", "blockedSlots"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableSlots: { type: "integer" },
          bookingUtilization: { type: "number" },
          attendedUtilization: { type: "number" },
          noShowFraction: { type: "number" },
        },
        required: [
          "availableSlots",
          "bookingUtilization",
          "attendedUtilization",
          "noShowFraction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "booked",
            label: "Booked",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "attended",
            label: "Attended",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "slots",
            label: "Slots",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "blockedSlots",
            label: "Blocked Slots",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "availableSlots",
            label: "Available Slots",
            valueType: { type: "integer" },
          },
          {
            id: "bookingUtilization",
            label: "Booking Utilization",
            valueType: { type: "number" },
          },
          {
            id: "attendedUtilization",
            label: "Attended Utilization",
            valueType: { type: "number" },
          },
          {
            id: "noShowFraction",
            label: "No Show Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicCounterAppointmentUtilizationTermTool.execute;
export default publicCounterAppointmentUtilizationTermTool;
