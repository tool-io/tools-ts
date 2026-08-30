import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MoonphaseDriftPerYearInput = Readonly<{
  readonly displayCycleDays: number;
  readonly trueSynodicDays: number;
}>;
export type MoonphaseDriftPerYearOutput = Readonly<{
  readonly phaseErrorDaysPerYear: number;
}>;

export const calculateMoonphaseDriftPerYear = (
  x: MoonphaseDriftPerYearInput,
): MoonphaseDriftPerYearOutput => {
  if (!Number.isFinite(x.displayCycleDays) || x.displayCycleDays <= 0)
    simpleError("displayCycleDays", "Provide a finite positive number.");
  if (!Number.isFinite(x.trueSynodicDays) || x.trueSynodicDays <= 0)
    simpleError("trueSynodicDays", "Provide a finite positive number.");
  const phaseErrorDaysPerYear =
    365.25 * (x.trueSynodicDays / x.displayCycleDays - 1);
  if (!Number.isFinite(phaseErrorDaysPerYear))
    simpleError(
      "phaseErrorDaysPerYear",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    phaseErrorDaysPerYear: Object.is(phaseErrorDaysPerYear, -0)
      ? 0
      : phaseErrorDaysPerYear,
  };
};

export const example = {
  input: {
    displayCycleDays: 29.5,
    trueSynodicDays: 29.530588,
  },
  output: { phaseErrorDaysPerYear: 0.37872091525426277 },
} satisfies ToolExample<
  MoonphaseDriftPerYearInput,
  MoonphaseDriftPerYearOutput
>;

export const tool = createSimpleTool({
  id: "horology/moonphase-drift-per-year",
  title: "Moonphase Drift Per Year",
  description:
    "Signed lunar-phase error in equivalent lunar days per Julian year from the displayed and true synodic cycle lengths.",
  inputs: [
    {
      id: "displayCycleDays",
      kind: "number",
      label: "Display Cycle Days",
      unit: "day",
      minimum: 0,
    },
    {
      id: "trueSynodicDays",
      kind: "number",
      label: "True Synodic Days",
      unit: "day",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "phaseErrorDaysPerYear",
      kind: "number",
      label: "Phase Error Days Per Year",
      unit: "day/year",
    },
  ],
  calculate: (input) =>
    calculateMoonphaseDriftPerYear({
      displayCycleDays: input.displayCycleDays as number,
      trueSynodicDays: input.trueSynodicDays as number,
    }),
});
export const moonphaseDriftPerYearTool = tool;
export const runMoonphaseDriftPerYear = tool.execute;
export default tool;
