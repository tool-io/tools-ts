import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullAmount: number;
  readonly activeDays: number;
  readonly calendarDays: number;
  readonly suppliedBasisDays: number;
  readonly useCalendar: boolean;
};
export type Output = { readonly basis: number; readonly prorated: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullAmount: { type: "number", minimum: 0 },
    activeDays: { type: "integer", minimum: 0 },
    calendarDays: { type: "integer", minimum: 1 },
    suppliedBasisDays: { type: "integer", minimum: 1 },
    useCalendar: { type: "boolean" },
  },
  required: [
    "fullAmount",
    "activeDays",
    "calendarDays",
    "suppliedBasisDays",
    "useCalendar",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { basis: { type: "integer" }, prorated: { type: "number" } },
  required: ["basis", "prorated"],
} as const;
/** Calculate recurring revenue proration day basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    fullAmount,
    activeDays,
    calendarDays,
    suppliedBasisDays,
    useCalendar,
  } = request;
  const compute = (): Output => {
    H.domain(fullAmount >= 0);
    H.integer(activeDays, 0);
    H.integer(calendarDays, 1);
    H.integer(suppliedBasisDays, 1);
    return {
      basis: useCalendar ? calendarDays : suppliedBasisDays,
      prorated:
        (fullAmount * activeDays) /
        (useCalendar ? calendarDays : suppliedBasisDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fullAmount: 300,
    activeDays: 15,
    calendarDays: 31,
    suppliedBasisDays: 30,
    useCalendar: true,
  },
  output: { basis: 31, prorated: 145.16129032258064 },
} satisfies ToolExample<Input, Output>;
export const recurringRevenueProrationDayBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/recurring-revenue-proration-day-basis",
    title: "Recurring Revenue Proration Day Basis Tool",
    description:
      "Calculate recurring revenue proration day basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullAmount: { type: "number", minimum: 0 },
        activeDays: { type: "integer", minimum: 0 },
        calendarDays: { type: "integer", minimum: 1 },
        suppliedBasisDays: { type: "integer", minimum: 1 },
        useCalendar: { type: "boolean" },
      },
      required: [
        "fullAmount",
        "activeDays",
        "calendarDays",
        "suppliedBasisDays",
        "useCalendar",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { basis: { type: "integer" }, prorated: { type: "number" } },
      required: ["basis", "prorated"],
    },
    ports: {
      inputs: [
        {
          id: "fullAmount",
          label: "Full Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeDays",
          label: "Active Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "calendarDays",
          label: "Calendar Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedBasisDays",
          label: "Supplied Basis Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useCalendar",
          label: "Use Calendar",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "basis", label: "Basis", valueType: { type: "integer" } },
        { id: "prorated", label: "Prorated", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recurringRevenueProrationDayBasisTool.execute;
export default recurringRevenueProrationDayBasisTool;
