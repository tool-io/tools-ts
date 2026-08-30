import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const parseDate = (value: string, field: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    simpleError(
      field,
      "Date must use YYYY-MM-DD format.",
      "date_format_invalid",
    );
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    simpleError(field, "Date is not a valid calendar date.", "date_invalid");
  return date;
};

const calendarAge = (from: Date, to: Date) => {
  const fromYear = from.getUTCFullYear();
  let years = to.getUTCFullYear() - fromYear;
  let anniversary = Date.UTC(
    fromYear + years,
    from.getUTCMonth(),
    from.getUTCDate(),
  );
  if (anniversary > to.getTime()) {
    years -= 1;
    anniversary = Date.UTC(
      fromYear + years,
      from.getUTCMonth(),
      from.getUTCDate(),
    );
  }
  const months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    to.getUTCMonth() -
    from.getUTCMonth() -
    Number(to.getUTCDate() < from.getUTCDate());
  const monthsFromAnniversary = new Date(anniversary);
  monthsFromAnniversary.setUTCMonth(
    monthsFromAnniversary.getUTCMonth() + (months - years * 12),
  );
  return {
    days: Math.floor(
      (to.getTime() - monthsFromAnniversary.getTime()) / 86_400_000,
    ),
    months: months % 12,
    years,
  };
};

export type VintageServiceScheduleInput = {
  readonly lastServiceDate: string;
  readonly planningHorizonYears: number;
  readonly quotedServiceCost: number;
  readonly asOfDate: string;
  readonly callerSpecifiedIntervalYears: number;
};

export type VintageServiceScheduleOutput = {
  readonly ageDays: number;
  readonly ageMonths: number;
  readonly ageYears: number;
  readonly nextServiceDue: boolean;
  readonly plannedServiceBudget: number;
  readonly servicesDueWithinHorizon: number;
  readonly yearsUntilNextService: number;
};

export const planVintageServiceSchedule = (
  input: VintageServiceScheduleInput,
): VintageServiceScheduleOutput => {
  const lastService = parseDate(input.lastServiceDate, "lastServiceDate");
  const asOf = parseDate(input.asOfDate, "asOfDate");
  if (asOf.getTime() < lastService.getTime())
    simpleError(
      "asOfDate",
      "As-of date must not precede the last service date.",
      "date_order_invalid",
    );
  if (
    !Number.isFinite(input.callerSpecifiedIntervalYears) ||
    input.callerSpecifiedIntervalYears <= 0
  )
    simpleError(
      "callerSpecifiedIntervalYears",
      "Service interval must be finite and positive.",
      "service_interval_invalid",
    );
  if (
    !Number.isFinite(input.planningHorizonYears) ||
    input.planningHorizonYears < 0
  )
    simpleError(
      "planningHorizonYears",
      "Planning horizon must be finite and nonnegative.",
      "planning_horizon_invalid",
    );
  if (!Number.isFinite(input.quotedServiceCost) || input.quotedServiceCost < 0)
    simpleError(
      "quotedServiceCost",
      "Service cost must be finite and nonnegative.",
      "service_cost_invalid",
    );
  const age = calendarAge(lastService, asOf);
  const yearsUntilNextService = Math.max(
    0,
    input.callerSpecifiedIntervalYears - age.years,
  );
  const nextServiceDue = yearsUntilNextService === 0;
  const servicesDueWithinHorizon =
    yearsUntilNextService > input.planningHorizonYears
      ? 0
      : 1 +
        Math.floor(
          (input.planningHorizonYears - yearsUntilNextService) /
            input.callerSpecifiedIntervalYears,
        );
  return {
    ageDays: age.days,
    ageMonths: age.months,
    ageYears: age.years,
    nextServiceDue,
    plannedServiceBudget: servicesDueWithinHorizon * input.quotedServiceCost,
    servicesDueWithinHorizon,
    yearsUntilNextService,
  };
};

export const vintageServiceScheduleExample = {
  input: {
    asOfDate: "2026-01-14",
    callerSpecifiedIntervalYears: 5,
    lastServiceDate: "2020-01-15",
    planningHorizonYears: 10,
    quotedServiceCost: 1000,
  },
  output: {
    ageDays: 30,
    ageMonths: 11,
    ageYears: 5,
    nextServiceDue: true,
    plannedServiceBudget: 3000,
    servicesDueWithinHorizon: 3,
    yearsUntilNextService: 0,
  },
} satisfies ToolExample<
  VintageServiceScheduleInput,
  VintageServiceScheduleOutput
>;

export const vintageServiceScheduleTool = createSimpleTool({
  calculate: (input) =>
    planVintageServiceSchedule({
      asOfDate: input.asOfDate as string,
      callerSpecifiedIntervalYears:
        input.callerSpecifiedIntervalYears as number,
      lastServiceDate: input.lastServiceDate as string,
      planningHorizonYears: input.planningHorizonYears as number,
      quotedServiceCost: input.quotedServiceCost as number,
    }),
  description:
    "Plan service timing and budget from a caller-specified interval and quote; no universal vintage overhaul interval is asserted.",
  id: "horology/vintage-service-schedule-budget-planner",
  inputs: [
    { format: "date", id: "asOfDate", kind: "string", label: "As-of date" },
    {
      id: "callerSpecifiedIntervalYears",
      kind: "number",
      label: "Caller-specified service interval",
      minimum: 0,
      unit: "year",
    },
    {
      format: "date",
      id: "lastServiceDate",
      kind: "string",
      label: "Last service date",
    },
    {
      id: "planningHorizonYears",
      kind: "number",
      label: "Planning horizon",
      minimum: 0,
      unit: "year",
    },
    {
      id: "quotedServiceCost",
      kind: "number",
      label: "Quoted service cost",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "ageDays",
      kind: "integer",
      label: "Age after completed years and months",
      minimum: 0,
      unit: "d",
    },
    {
      id: "ageMonths",
      kind: "integer",
      label: "Age months after completed years",
      minimum: 0,
      unit: "month",
    },
    {
      id: "ageYears",
      kind: "integer",
      label: "Completed service-age years",
      minimum: 0,
      unit: "year",
    },
    {
      id: "nextServiceDue",
      kind: "boolean",
      label: "Next service due at as-of date",
    },
    {
      id: "plannedServiceBudget",
      kind: "number",
      label: "Planned service budget",
      minimum: 0,
    },
    {
      id: "servicesDueWithinHorizon",
      kind: "integer",
      label: "Services due within planning horizon",
      minimum: 0,
    },
    {
      id: "yearsUntilNextService",
      kind: "number",
      label: "Years until next service",
      minimum: 0,
      unit: "year",
    },
  ],
  title: "Vintage Service Schedule Budget Planner",
});

export const runVintageServiceSchedule = vintageServiceScheduleTool.execute;
export default vintageServiceScheduleTool;
