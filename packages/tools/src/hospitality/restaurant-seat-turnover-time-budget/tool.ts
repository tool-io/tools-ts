import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serviceMinutes: number;
  readonly diningMinutes: number;
  readonly resetMinutes: number;
  readonly seats: number;
};
export type Output = {
  readonly turns: number;
  readonly covers: number;
  readonly remainderMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceMinutes: { type: "number", minimum: 0 },
    diningMinutes: { type: "number", exclusiveMinimum: 0 },
    resetMinutes: { type: "number", minimum: 0 },
    seats: { type: "integer", minimum: 0 },
  },
  required: ["serviceMinutes", "diningMinutes", "resetMinutes", "seats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turns: { type: "integer" },
    covers: { type: "integer" },
    remainderMinutes: { type: "number" },
  },
  required: ["turns", "covers", "remainderMinutes"],
} as const;
/** Budget complete dining-plus-reset cycles, including reset after every cycle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serviceMinutes, diningMinutes, resetMinutes, seats } = request;
  const compute = (): Output => {
    H.domain(serviceMinutes >= 0 && diningMinutes > 0 && resetMinutes >= 0);
    H.integer(seats, 0);
    return {
      turns: Math.floor(serviceMinutes / (diningMinutes + resetMinutes)),
      covers:
        seats * Math.floor(serviceMinutes / (diningMinutes + resetMinutes)),
      remainderMinutes: serviceMinutes % (diningMinutes + resetMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    serviceMinutes: 240,
    diningMinutes: 50,
    resetMinutes: 10,
    seats: 40,
  },
  output: { turns: 4, covers: 160, remainderMinutes: 0 },
} satisfies ToolExample<Input, Output>;
export const restaurantSeatTurnoverTimeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/restaurant-seat-turnover-time-budget",
    title: "Restaurant Seat Turnover Time Budget Tool",
    description:
      "Budget complete dining-plus-reset cycles, including reset after every cycle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceMinutes: { type: "number", minimum: 0 },
        diningMinutes: { type: "number", exclusiveMinimum: 0 },
        resetMinutes: { type: "number", minimum: 0 },
        seats: { type: "integer", minimum: 0 },
      },
      required: ["serviceMinutes", "diningMinutes", "resetMinutes", "seats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turns: { type: "integer" },
        covers: { type: "integer" },
        remainderMinutes: { type: "number" },
      },
      required: ["turns", "covers", "remainderMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "serviceMinutes",
          label: "Service Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diningMinutes",
          label: "Dining Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetMinutes",
          label: "Reset Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seats",
          label: "Seats",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "turns", label: "Turns", valueType: { type: "integer" } },
        { id: "covers", label: "Covers", valueType: { type: "integer" } },
        {
          id: "remainderMinutes",
          label: "Remainder Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = restaurantSeatTurnoverTimeBudgetTool.execute;
export default restaurantSeatTurnoverTimeBudgetTool;
