import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MoonphaseCorrectionDaysInput = Readonly<{
  readonly absoluteDriftDaysPerYear: number;
}>;
export type MoonphaseCorrectionDaysOutput = Readonly<{
  readonly yearsPerOneDayError: number;
}>;

export const calculateMoonphaseCorrectionDays = (
  x: MoonphaseCorrectionDaysInput,
): MoonphaseCorrectionDaysOutput => {
  if (
    !Number.isFinite(x.absoluteDriftDaysPerYear) ||
    x.absoluteDriftDaysPerYear <= 0
  )
    simpleError(
      "absoluteDriftDaysPerYear",
      "Provide a finite positive number.",
    );
  const yearsPerOneDayError = 1 / x.absoluteDriftDaysPerYear;
  if (!Number.isFinite(yearsPerOneDayError))
    simpleError(
      "yearsPerOneDayError",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    yearsPerOneDayError: Object.is(yearsPerOneDayError, -0)
      ? 0
      : yearsPerOneDayError,
  };
};

export const example = {
  input: {
    absoluteDriftDaysPerYear: 0.4,
  },
  output: { yearsPerOneDayError: 2.5 },
} satisfies ToolExample<
  MoonphaseCorrectionDaysInput,
  MoonphaseCorrectionDaysOutput
>;

export const tool = createSimpleTool({
  id: "horology/moonphase-correction-days",
  title: "Moonphase Correction Days",
  description:
    "Years until an absolute one-day lunar-phase display error from a nonzero drift measured in lunar days per year.",
  inputs: [
    {
      id: "absoluteDriftDaysPerYear",
      kind: "number",
      label: "Absolute Drift Days Per Year",
      unit: "day/year",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "yearsPerOneDayError",
      kind: "number",
      label: "Years Per One Day Error",
      unit: "year",
    },
  ],
  calculate: (input) =>
    calculateMoonphaseCorrectionDays({
      absoluteDriftDaysPerYear: input.absoluteDriftDaysPerYear as number,
    }),
});
export const moonphaseCorrectionDaysTool = tool;
export const runMoonphaseCorrectionDays = tool.execute;
export default tool;
