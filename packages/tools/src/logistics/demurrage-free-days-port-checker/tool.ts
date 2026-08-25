import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DemurrageFreeDaysPortCheckerInput = {
  readonly dischargeDate: string;
  readonly freeDays?: number;
  readonly pickupDate: string;
};

export type DemurrageFreeDaysPortCheckerOutput = {
  readonly chargeableDays: number;
  readonly lastFreeDayDate: string;
  readonly withinFreeWindow: boolean;
};

const DAY_MS = 86_400_000;

const parseIsoDay = (value: string, field: string): number => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match)
    return simpleError(
      field,
      `${field} must be a YYYY-MM-DD date.`,
      "date_invalid",
    );
  const utc = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(utc))
    return simpleError(
      field,
      `${field} must be a real calendar date.`,
      "date_impossible",
    );
  const parsed = new Date(utc);
  if (
    parsed.getUTCFullYear() !== Number(match[1]) ||
    parsed.getUTCMonth() !== Number(match[2]) - 1 ||
    parsed.getUTCDate() !== Number(match[3])
  )
    return simpleError(
      field,
      `${field} must be a real calendar date.`,
      "date_impossible",
    );
  return Math.floor(utc / DAY_MS);
};

const formatIsoDay = (day: number): string =>
  new Date(day * DAY_MS).toISOString().slice(0, 10);

export const calculateDemurrageFreeDaysPortChecker = (
  input: DemurrageFreeDaysPortCheckerInput,
): DemurrageFreeDaysPortCheckerOutput => {
  const freeDays = input.freeDays ?? 5;
  if (!(Number.isSafeInteger(freeDays) && freeDays >= 1))
    return simpleError(
      "freeDays",
      "Free days must be a positive whole number.",
      "invalid_free_days",
    );
  const dischargeDay = parseIsoDay(input.dischargeDate, "dischargeDate");
  const pickupDay = parseIsoDay(input.pickupDate, "pickupDate");
  if (pickupDay < dischargeDay)
    return simpleError(
      "pickupDate",
      "pickupDate must not precede dischargeDate.",
      "reversed_dates",
    );
  const lastFreeDay = dischargeDay + freeDays - 1;
  const lastFreeDayMs = lastFreeDay * DAY_MS;
  if (
    !Number.isFinite(lastFreeDayMs) ||
    Math.abs(lastFreeDayMs) > 8_640_000_000_000_000
  )
    return simpleError(
      "freeDays",
      "The last free day is outside the supported calendar range.",
      "date_out_of_range",
    );
  return {
    chargeableDays: Math.max(0, pickupDay - lastFreeDay),
    lastFreeDayDate: formatIsoDay(lastFreeDay),
    withinFreeWindow: pickupDay <= lastFreeDay,
  };
};

export const demurrageFreeDaysPortCheckerExample = {
  input: { dischargeDate: "2026-03-02", freeDays: 5, pickupDate: "2026-03-09" },
  output: {
    chargeableDays: 3,
    lastFreeDayDate: "2026-03-06",
    withinFreeWindow: false,
  },
} satisfies ToolExample<
  DemurrageFreeDaysPortCheckerInput,
  DemurrageFreeDaysPortCheckerOutput
>;

export const demurrageFreeDaysPortCheckerTool = createSimpleTool({
  id: "logistics/demurrage-free-days-port-checker",
  title: "Demurrage Free Days Port Checker",
  description:
    "Count container demurrage days using inclusive free time that starts on the discharge day, so the last free day is discharge date plus free days minus one and chargeable days run after it through pickup.",
  inputs: [
    {
      description: "Container discharge date at the terminal (YYYY-MM-DD).",
      id: "dischargeDate",
      kind: "string",
      label: "Discharge date",
    },
    {
      default: 5,
      description: "Combined free days granted by the carrier and port.",
      id: "freeDays",
      kind: "integer",
      label: "Free days",
      minimum: 1,
    },
    {
      description: "Full gate-out / pickup date (YYYY-MM-DD).",
      id: "pickupDate",
      kind: "string",
      label: "Pickup date",
    },
  ],
  outputs: [
    {
      description: "Chargeable demurrage days after the last free day.",
      id: "chargeableDays",
      kind: "integer",
      label: "Chargeable days",
    },
    {
      description: "Last day of the free window (YYYY-MM-DD).",
      id: "lastFreeDayDate",
      kind: "string",
      label: "Last free day",
    },
    {
      description: "True when pickup happened inside the free window.",
      id: "withinFreeWindow",
      kind: "boolean",
      label: "Within free window",
    },
  ],
  calculate: (input) =>
    calculateDemurrageFreeDaysPortChecker({
      dischargeDate: input.dischargeDate as string,
      freeDays: input.freeDays as number | undefined,
      pickupDate: input.pickupDate as string,
    }),
});

export const runDemurrageFreeDaysPortChecker =
  demurrageFreeDaysPortCheckerTool.execute;
export default demurrageFreeDaysPortCheckerTool;
