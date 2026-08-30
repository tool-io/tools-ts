import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DailyRateToAnnualDriftInput = Readonly<{
  readonly secondsPerDay: number;
  readonly daysInYear: number;
}>;
export type DailyRateToAnnualDriftOutput = Readonly<{
  readonly annualSeconds: number;
}>;

export const calculateDailyRateToAnnualDrift = (
  x: DailyRateToAnnualDriftInput,
): DailyRateToAnnualDriftOutput => {
  if (!Number.isFinite(x.secondsPerDay))
    simpleError("secondsPerDay", "Provide a finite number.");
  if (
    !Number.isFinite(x.daysInYear) ||
    !Number.isSafeInteger(x.daysInYear) ||
    x.daysInYear < 1
  )
    simpleError("daysInYear", "Provide a positive safe integer.");
  if (!(x.daysInYear <= 366))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const annualSeconds = x.secondsPerDay * x.daysInYear;
  if (!Number.isFinite(annualSeconds))
    simpleError(
      "annualSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { annualSeconds: Object.is(annualSeconds, -0) ? 0 : annualSeconds };
};

export const example = {
  input: {
    secondsPerDay: 5,
    daysInYear: 365,
  },
  output: { annualSeconds: 1825 },
} satisfies ToolExample<
  DailyRateToAnnualDriftInput,
  DailyRateToAnnualDriftOutput
>;

export const tool = createSimpleTool({
  id: "horology/daily-rate-to-annual-drift",
  title: "Daily Rate To Annual Drift",
  description:
    "Signed clock drift over a supplied year length in days from seconds gained or lost per day.",
  inputs: [
    {
      id: "secondsPerDay",
      kind: "number",
      label: "Seconds Per Day",
      unit: "s/day",
    },
    {
      id: "daysInYear",
      kind: "integer",
      label: "Days In Year",
      unit: "day",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "annualSeconds", kind: "number", label: "Annual Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculateDailyRateToAnnualDrift({
      secondsPerDay: input.secondsPerDay as number,
      daysInYear: input.daysInYear as number,
    }),
});
export const dailyRateToAnnualDriftTool = tool;
export const runDailyRateToAnnualDrift = tool.execute;
export default tool;
