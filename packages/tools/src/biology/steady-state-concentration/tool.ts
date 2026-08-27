import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const steadyStateConcentrationExample = {
  input: { clearanceLPerHour: 2, doseMgPerHour: 10 },
  output: { steadyStateConcentrationMgPerL: 5 },
} satisfies ToolExample<
  {
    readonly bioavailabilityFraction?: number;
    readonly clearanceLPerHour: number;
    readonly doseMgPerHour: number;
  },
  { readonly steadyStateConcentrationMgPerL: number }
>;

export const steadyStateConcentrationTool = createSimpleTool({
  id: "biology/steady-state-concentration",
  title: "Steady-State Concentration",
  description:
    "Predict the average plasma concentration at steady state as the infusion rate times bioavailability divided by clearance.",
  inputs: [
    {
      description:
        "Dosing rate in milligrams per hour; must be greater than zero.",
      id: "doseMgPerHour",
      label: "Dose rate",
      kind: "number",
      unit: "mg/h",
    },
    {
      description: "Clearance in litres per hour; must be greater than zero.",
      id: "clearanceLPerHour",
      label: "Clearance",
      kind: "number",
      unit: "L/h",
    },
    {
      default: 1,
      description:
        "Systemic bioavailability fraction between zero and one; defaults to one.",
      id: "bioavailabilityFraction",
      label: "Bioavailability fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Average concentration at steady state in mg/L.",
      id: "steadyStateConcentrationMgPerL",
      label: "Steady-state concentration",
      kind: "number",
      unit: "mg/L",
    },
  ],
  calculate: (input) => {
    const doseMgPerHour = input.doseMgPerHour as number;
    const clearanceLPerHour = input.clearanceLPerHour as number;
    const bioavailabilityFraction = input.bioavailabilityFraction as number;
    if (!(doseMgPerHour > 0))
      simpleError(
        "doseMgPerHour",
        "The dose rate must be greater than zero.",
        "invalid_dose_rate",
      );
    if (!(clearanceLPerHour > 0))
      simpleError(
        "clearanceLPerHour",
        "The clearance must be greater than zero.",
        "invalid_clearance",
      );
    return {
      steadyStateConcentrationMgPerL:
        (doseMgPerHour * bioavailabilityFraction) / clearanceLPerHour,
    };
  },
});
export const runSteadyStateConcentration = steadyStateConcentrationTool.execute;
export default steadyStateConcentrationTool;
