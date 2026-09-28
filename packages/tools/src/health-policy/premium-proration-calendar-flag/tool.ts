import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly premium: number;
  readonly calendarCoveredDays: number;
  readonly calendarPeriodDays: number;
  readonly suppliedCoveredBasisDays: number;
  readonly suppliedPeriodBasisDays: number;
  readonly useCalendar: boolean;
};
export type Output = {
  readonly fraction: number;
  readonly proratedPremium: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premium: { type: "number", minimum: 0 },
    calendarCoveredDays: { type: "integer", minimum: 0 },
    calendarPeriodDays: { type: "integer", minimum: 1 },
    suppliedCoveredBasisDays: { type: "integer", minimum: 0 },
    suppliedPeriodBasisDays: { type: "integer", minimum: 1 },
    useCalendar: { type: "boolean" },
  },
  required: [
    "premium",
    "calendarCoveredDays",
    "calendarPeriodDays",
    "suppliedCoveredBasisDays",
    "suppliedPeriodBasisDays",
    "useCalendar",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    proratedPremium: { type: "number" },
  },
  required: ["fraction", "proratedPremium"],
} as const;
/** Apply explicitly resolved calendar or alternative basis days, without inferring insurance terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    premium,
    calendarCoveredDays,
    calendarPeriodDays,
    suppliedCoveredBasisDays,
    suppliedPeriodBasisDays,
    useCalendar,
  } = request;
  const compute = (): Output => {
    H.integer(calendarPeriodDays, 1);
    H.integer(suppliedPeriodBasisDays, 1);
    H.integer(calendarCoveredDays, 0, calendarPeriodDays);
    H.integer(suppliedCoveredBasisDays, 0, suppliedPeriodBasisDays);
    H.domain(premium >= 0);
    return {
      fraction: useCalendar
        ? calendarCoveredDays / calendarPeriodDays
        : suppliedCoveredBasisDays / suppliedPeriodBasisDays,
      proratedPremium:
        premium *
        (useCalendar
          ? calendarCoveredDays / calendarPeriodDays
          : suppliedCoveredBasisDays / suppliedPeriodBasisDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    premium: 120,
    calendarCoveredDays: 15,
    calendarPeriodDays: 30,
    suppliedCoveredBasisDays: 14,
    suppliedPeriodBasisDays: 28,
    useCalendar: true,
  },
  output: { fraction: 0.5, proratedPremium: 60 },
} satisfies ToolExample<Input, Output>;
export const premiumProrationCalendarFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/premium-proration-calendar-flag",
    title: "Premium Proration Calendar Flag Tool",
    description:
      "Apply explicitly resolved calendar or alternative basis days, without inferring insurance terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premium: { type: "number", minimum: 0 },
        calendarCoveredDays: { type: "integer", minimum: 0 },
        calendarPeriodDays: { type: "integer", minimum: 1 },
        suppliedCoveredBasisDays: { type: "integer", minimum: 0 },
        suppliedPeriodBasisDays: { type: "integer", minimum: 1 },
        useCalendar: { type: "boolean" },
      },
      required: [
        "premium",
        "calendarCoveredDays",
        "calendarPeriodDays",
        "suppliedCoveredBasisDays",
        "suppliedPeriodBasisDays",
        "useCalendar",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        proratedPremium: { type: "number" },
      },
      required: ["fraction", "proratedPremium"],
    },
    ports: {
      inputs: [
        {
          id: "premium",
          label: "Premium",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calendarCoveredDays",
          label: "Calendar Covered Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "calendarPeriodDays",
          label: "Calendar Period Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedCoveredBasisDays",
          label: "Supplied Covered Basis Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedPeriodBasisDays",
          label: "Supplied Period Basis Days",
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
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "proratedPremium",
          label: "Prorated Premium",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = premiumProrationCalendarFlagTool.execute;
export default premiumProrationCalendarFlagTool;
