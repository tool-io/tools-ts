import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodRent: number;
  readonly occupiedDays: number;
  readonly periodDays: number;
};
export type Output = { readonly proratedRent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodRent: { type: "number", minimum: 0 },
    occupiedDays: { type: "integer", minimum: 0 },
    periodDays: { type: "integer", minimum: 1 },
  },
  required: ["periodRent", "occupiedDays", "periodDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { proratedRent: { type: "number" } },
  required: ["proratedRent"],
} as const;
/** Prorate rent under an explicitly supplied actual-period-day denominator, without assuming a lease or statutory day-count rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodRent, occupiedDays, periodDays } = request;
  const compute = (): Output => {
    H.domain(periodRent >= 0, "periodRent");
    (H.domain(
      Number.isSafeInteger(periodDays) &&
        periodDays >= 1 &&
        periodDays <= Number.MAX_SAFE_INTEGER,
      "periodDays",
    ),
      periodDays);
    (H.domain(
      Number.isSafeInteger(occupiedDays) &&
        occupiedDays >= 0 &&
        occupiedDays <= periodDays,
      "occupiedDays",
    ),
      occupiedDays);
    return { proratedRent: (periodRent * occupiedDays) / periodDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { periodRent: 1200, occupiedDays: 10, periodDays: 30 },
  output: { proratedRent: 400 },
} satisfies ToolExample<Input, Output>;
export const rentProRatedOccupancyDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/rent-pro-rated-occupancy-day",
    title: "Rent Pro Rated Occupancy Day Tool",
    description:
      "Prorate rent under an explicitly supplied actual-period-day denominator, without assuming a lease or statutory day-count rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodRent: { type: "number", minimum: 0 },
        occupiedDays: { type: "integer", minimum: 0 },
        periodDays: { type: "integer", minimum: 1 },
      },
      required: ["periodRent", "occupiedDays", "periodDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { proratedRent: { type: "number" } },
      required: ["proratedRent"],
    },
    ports: {
      inputs: [
        {
          id: "periodRent",
          label: "Period Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedDays",
          label: "Occupied Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodDays",
          label: "Period Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "proratedRent",
          label: "Prorated Rent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rentProRatedOccupancyDayTool.execute;
export default rentProRatedOccupancyDayTool;
