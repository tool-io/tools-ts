import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hireRevenuePerDay: number;
  readonly dailyCost: number;
  readonly billableDays: number;
  readonly nonbillableCost: number;
};
export type Output = {
  readonly contribution: number;
  readonly perBillableDay: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hireRevenuePerDay: { type: "number" },
    dailyCost: { type: "number", minimum: 0 },
    billableDays: { type: "number", minimum: 0 },
    nonbillableCost: { type: "number", minimum: 0 },
  },
  required: [
    "hireRevenuePerDay",
    "dailyCost",
    "billableDays",
    "nonbillableCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contribution: { type: "number" },
    perBillableDay: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["contribution", "perBillableDay", "defined"],
} as const;
/** Supplied equipment-hire contribution accounting without revenue or utilization forecasts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hireRevenuePerDay, dailyCost, billableDays, nonbillableCost } =
    request;
  const compute = (): Output => {
    H.domain(billableDays >= 0 && dailyCost >= 0 && nonbillableCost >= 0);
    return {
      contribution:
        (hireRevenuePerDay - dailyCost) * billableDays - nonbillableCost,
      perBillableDay:
        billableDays > 0
          ? ((hireRevenuePerDay - dailyCost) * billableDays - nonbillableCost) /
            billableDays
          : 0,
      defined: billableDays > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hireRevenuePerDay: 100,
    dailyCost: 60,
    billableDays: 5,
    nonbillableCost: 50,
  },
  output: { contribution: 150, perBillableDay: 30, defined: true },
} satisfies ToolExample<Input, Output>;
export const equipmentHireDayMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/equipment-hire-day-margin",
    title: "Equipment Hire Day Margin Tool",
    description:
      "Supplied equipment-hire contribution accounting without revenue or utilization forecasts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hireRevenuePerDay: { type: "number" },
        dailyCost: { type: "number", minimum: 0 },
        billableDays: { type: "number", minimum: 0 },
        nonbillableCost: { type: "number", minimum: 0 },
      },
      required: [
        "hireRevenuePerDay",
        "dailyCost",
        "billableDays",
        "nonbillableCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contribution: { type: "number" },
        perBillableDay: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["contribution", "perBillableDay", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "hireRevenuePerDay",
          label: "Hire Revenue Per Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyCost",
          label: "Daily Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "billableDays",
          label: "Billable Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonbillableCost",
          label: "Nonbillable Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
        {
          id: "perBillableDay",
          label: "Per Billable Day",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = equipmentHireDayMarginTool.execute;
export default equipmentHireDayMarginTool;
