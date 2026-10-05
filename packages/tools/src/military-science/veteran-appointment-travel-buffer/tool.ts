import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appointmentMinute: number;
  readonly departureMinute: number;
  readonly travelMinutes: number;
};
export type Output = {
  readonly arrivalMinute: number;
  readonly bufferMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appointmentMinute: { type: "integer", minimum: 0 },
    departureMinute: { type: "integer", minimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
  },
  required: ["appointmentMinute", "departureMinute", "travelMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalMinute: { type: "number" },
    bufferMinutes: { type: "number" },
  },
  required: ["arrivalMinute", "bufferMinutes"],
} as const;
/** Compare planned travel arrival with an appointment on one shared minute timeline; negative buffer indicates lateness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { appointmentMinute, departureMinute, travelMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(appointmentMinute) &&
        appointmentMinute >= 0 &&
        appointmentMinute <= Number.MAX_SAFE_INTEGER,
      "appointmentMinute",
    ),
      appointmentMinute);
    (H.domain(
      Number.isSafeInteger(departureMinute) &&
        departureMinute >= 0 &&
        departureMinute <= Number.MAX_SAFE_INTEGER,
      "departureMinute",
    ),
      departureMinute);
    H.domain(travelMinutes >= 0, "travelMinutes");
    return {
      arrivalMinute: departureMinute + travelMinutes,
      bufferMinutes: appointmentMinute - departureMinute - travelMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { appointmentMinute: 600, departureMinute: 540, travelMinutes: 45 },
  output: { arrivalMinute: 585, bufferMinutes: 15 },
} satisfies ToolExample<Input, Output>;
export const veteranAppointmentTravelBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/veteran-appointment-travel-buffer",
    title: "Veteran Appointment Travel Buffer Tool",
    description:
      "Compare planned travel arrival with an appointment on one shared minute timeline; negative buffer indicates lateness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appointmentMinute: { type: "integer", minimum: 0 },
        departureMinute: { type: "integer", minimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
      },
      required: ["appointmentMinute", "departureMinute", "travelMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalMinute: { type: "number" },
        bufferMinutes: { type: "number" },
      },
      required: ["arrivalMinute", "bufferMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "appointmentMinute",
          label: "Appointment Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "departureMinute",
          label: "Departure Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "arrivalMinute",
          label: "Arrival Minute",
          valueType: { type: "number" },
        },
        {
          id: "bufferMinutes",
          label: "Buffer Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = veteranAppointmentTravelBufferTool.execute;
export default veteranAppointmentTravelBufferTool;
