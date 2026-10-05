import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reservedMinute: number;
  readonly arrivalMinute: number;
  readonly graceMinutes: number;
};
export type Output = {
  readonly delayMinutes: number;
  readonly beyondGrace: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reservedMinute: { type: "integer", minimum: 0 },
    arrivalMinute: { type: "integer", minimum: 0 },
    graceMinutes: { type: "number", minimum: 0 },
  },
  required: ["reservedMinute", "arrivalMinute", "graceMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delayMinutes: { type: "integer" },
    beyondGrace: { type: "boolean" },
  },
  required: ["delayMinutes", "beyondGrace"],
} as const;
/** Compare a signed reservation arrival delay with a caller-supplied inclusive grace period; no cancellation action is taken. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reservedMinute, arrivalMinute, graceMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(reservedMinute) &&
        reservedMinute >= 0 &&
        reservedMinute <= Number.MAX_SAFE_INTEGER,
      "reservedMinute",
    ),
      reservedMinute);
    (H.domain(
      Number.isSafeInteger(arrivalMinute) &&
        arrivalMinute >= 0 &&
        arrivalMinute <= Number.MAX_SAFE_INTEGER,
      "arrivalMinute",
    ),
      arrivalMinute);
    H.domain(graceMinutes >= 0, "graceMinutes");
    return {
      delayMinutes: arrivalMinute - reservedMinute,
      beyondGrace: arrivalMinute - reservedMinute > graceMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reservedMinute: 1140, arrivalMinute: 1155, graceMinutes: 10 },
  output: { delayMinutes: 15, beyondGrace: true },
} satisfies ToolExample<Input, Output>;
export const restaurantReservationLatearrivalGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hospitality/restaurant-reservation-latearrival-gap",
      title: "Restaurant Reservation Latearrival Gap Tool",
      description:
        "Compare a signed reservation arrival delay with a caller-supplied inclusive grace period; no cancellation action is taken.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reservedMinute: { type: "integer", minimum: 0 },
          arrivalMinute: { type: "integer", minimum: 0 },
          graceMinutes: { type: "number", minimum: 0 },
        },
        required: ["reservedMinute", "arrivalMinute", "graceMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          delayMinutes: { type: "integer" },
          beyondGrace: { type: "boolean" },
        },
        required: ["delayMinutes", "beyondGrace"],
      },
      ports: {
        inputs: [
          {
            id: "reservedMinute",
            label: "Reserved Minute",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "arrivalMinute",
            label: "Arrival Minute",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "graceMinutes",
            label: "Grace Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "delayMinutes",
            label: "Delay Minutes",
            valueType: { type: "integer" },
          },
          {
            id: "beyondGrace",
            label: "Beyond Grace",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = restaurantReservationLatearrivalGapTool.execute;
export default restaurantReservationLatearrivalGapTool;
