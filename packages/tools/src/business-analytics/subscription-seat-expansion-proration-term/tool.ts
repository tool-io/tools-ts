import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldSeats: number;
  readonly newSeats: number;
  readonly unitPeriodPrice: number;
  readonly remainingDays: number;
  readonly periodDays: number;
};
export type Output = {
  readonly seatChange: number;
  readonly proratedChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldSeats: { type: "integer", minimum: 0 },
    newSeats: { type: "integer", minimum: 0 },
    unitPeriodPrice: { type: "number", minimum: 0 },
    remainingDays: { type: "integer", minimum: 0 },
    periodDays: { type: "integer", minimum: 1 },
  },
  required: [
    "oldSeats",
    "newSeats",
    "unitPeriodPrice",
    "remainingDays",
    "periodDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatChange: { type: "integer" },
    proratedChange: { type: "number" },
  },
  required: ["seatChange", "proratedChange"],
} as const;
/** Calculate subscription seat expansion proration term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldSeats, newSeats, unitPeriodPrice, remainingDays, periodDays } =
    request;
  const compute = (): Output => {
    H.integer(oldSeats, 0);
    H.integer(newSeats, 0);
    H.domain(unitPeriodPrice >= 0);
    H.integer(periodDays, 1);
    H.integer(remainingDays, 0, periodDays);
    return {
      seatChange: newSeats - oldSeats,
      proratedChange:
        ((newSeats - oldSeats) * unitPeriodPrice * remainingDays) / periodDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldSeats: 10,
    newSeats: 15,
    unitPeriodPrice: 20,
    remainingDays: 15,
    periodDays: 30,
  },
  output: { seatChange: 5, proratedChange: 50 },
} satisfies ToolExample<Input, Output>;
export const subscriptionSeatExpansionProrationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/subscription-seat-expansion-proration-term",
      title: "Subscription Seat Expansion Proration Term Tool",
      description:
        "Calculate subscription seat expansion proration term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldSeats: { type: "integer", minimum: 0 },
          newSeats: { type: "integer", minimum: 0 },
          unitPeriodPrice: { type: "number", minimum: 0 },
          remainingDays: { type: "integer", minimum: 0 },
          periodDays: { type: "integer", minimum: 1 },
        },
        required: [
          "oldSeats",
          "newSeats",
          "unitPeriodPrice",
          "remainingDays",
          "periodDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seatChange: { type: "integer" },
          proratedChange: { type: "number" },
        },
        required: ["seatChange", "proratedChange"],
      },
      ports: {
        inputs: [
          {
            id: "oldSeats",
            label: "Old Seats",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "newSeats",
            label: "New Seats",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unitPeriodPrice",
            label: "Unit Period Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "remainingDays",
            label: "Remaining Days",
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
            id: "seatChange",
            label: "Seat Change",
            valueType: { type: "integer" },
          },
          {
            id: "proratedChange",
            label: "Prorated Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = subscriptionSeatExpansionProrationTermTool.execute;
export default subscriptionSeatExpansionProrationTermTool;
