import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDay: number;
  readonly expiryDay: number;
  readonly suppliedReserveDays: number;
};
export type Output = {
  readonly calendarRemainder: number;
  readonly beyondReserve: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDay: { type: "integer" },
    expiryDay: { type: "integer" },
    suppliedReserveDays: { type: "integer", minimum: 0 },
  },
  required: ["currentDay", "expiryDay", "suppliedReserveDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarRemainder: { type: "integer" },
    beyondReserve: { type: "integer" },
  },
  required: ["calendarRemainder", "beyondReserve"],
} as const;
/** Supplied stock expiry/review ledger without deciding storage stability, dispensing or medicine usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentDay, expiryDay, suppliedReserveDays } = request;
  const compute = (): Output => {
    H.integer(suppliedReserveDays, 0);
    return {
      calendarRemainder: expiryDay - currentDay,
      beyondReserve: expiryDay - currentDay - suppliedReserveDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentDay: 100, expiryDay: 130, suppliedReserveDays: 10 },
  output: { calendarRemainder: 30, beyondReserve: 20 },
} satisfies ToolExample<Input, Output>;
export const stockExpiryWindowRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/stock-expiry-window-remainder",
    title: "Stock Expiry Window Remainder Tool",
    description:
      "Supplied stock expiry/review ledger without deciding storage stability, dispensing or medicine usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDay: { type: "integer" },
        expiryDay: { type: "integer" },
        suppliedReserveDays: { type: "integer", minimum: 0 },
      },
      required: ["currentDay", "expiryDay", "suppliedReserveDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarRemainder: { type: "integer" },
        beyondReserve: { type: "integer" },
      },
      required: ["calendarRemainder", "beyondReserve"],
    },
    ports: {
      inputs: [
        {
          id: "currentDay",
          label: "Current Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiryDay",
          label: "Expiry Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedReserveDays",
          label: "Supplied Reserve Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "calendarRemainder",
          label: "Calendar Remainder",
          valueType: { type: "integer" },
        },
        {
          id: "beyondReserve",
          label: "Beyond Reserve",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = stockExpiryWindowRemainderTool.execute;
export default stockExpiryWindowRemainderTool;
