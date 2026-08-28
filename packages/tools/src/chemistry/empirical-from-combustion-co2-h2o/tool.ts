import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const empiricalFromCombustionCo2H2oTool = createSimpleTool({
  id: "chemistry/empirical-from-combustion-co2-h2o",
  title: "Empirical Formula From CO2 and H2O Calculator",
  description:
    "Derive the empirical formula CₓHᵧ from combustion analysis CO₂ and H₂O masses normalized to whole-number ratios.",
  inputs: [
    {
      description: "Mass of CO₂ produced.",
      id: "co2MassG",
      label: "CO₂ mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Mass of H₂O produced.",
      id: "h2oMassG",
      label: "H₂O mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Whole-number subscripts for C and H.",
      id: "subscripts",
      label: "Subscripts",
      kind: "object",
    },
  ],
  calculate: (input) => {
    if (!((input.co2MassG as number) > 0))
      simpleError("co2MassG", "Carbon dioxide mass must be greater than zero.");
    if (!((input.h2oMassG as number) > 0))
      simpleError("h2oMassG", "Water mass must be greater than zero.");
    const molesC = (input.co2MassG as number) / 44.0095;
    const molesH = ((input.h2oMassG as number) * 2) / 18.01528;
    const smallest = Math.min(molesC, molesH);
    const normalized = [molesC / smallest, molesH / smallest];
    let multiplier = 1;
    for (; multiplier <= 12; multiplier += 1) {
      if (
        normalized.every(
          (ratio) =>
            Math.abs(ratio * multiplier - Math.round(ratio * multiplier)) <
            0.03,
        )
      )
        break;
    }
    if (multiplier > 12)
      simpleError(
        "co2MassG",
        "The measured masses do not resolve to a small whole-number C:H ratio.",
        "unresolved_ratio",
      );
    return {
      subscripts: {
        C: Math.round(normalized[0]! * multiplier),
        H: Math.round(normalized[1]! * multiplier),
      },
    };
  },
});
export const runEmpiricalFormulaCombustionCo2H2o =
  empiricalFromCombustionCo2H2oTool.execute;
export default empiricalFromCombustionCo2H2oTool;

export type EmpiricalFromCombustionCo2H2oInput = {
  readonly co2MassG: number;
  readonly h2oMassG: number;
};

export type EmpiricalFromCombustionCo2H2oOutput = {
  readonly subscripts: Record<string, unknown>;
};

export const empiricalFromCombustionCo2H2oExample = {
  input: {
    co2MassG: 1,
    h2oMassG: 1,
  },
  output: {
    subscripts: {
      C: 1,
      H: 5,
    },
  },
} satisfies ToolExample<
  EmpiricalFromCombustionCo2H2oInput,
  EmpiricalFromCombustionCo2H2oOutput
>;
