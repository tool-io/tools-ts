import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const empiricalFormulaCombustionTool = createSimpleTool({
  id: "chemistry/empirical-formula-combustion",
  title: "Empirical Formula From Combustion Calculator",
  description:
    "Derive C:H mole ratios from combustion CO₂ and H₂O masses, normalized to the smallest amount.",
  inputs: [
    {
      description: "Mass of CO₂ captured during combustion.",
      id: "co2MassG",
      label: "CO₂ mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Mass of H₂O captured during combustion.",
      id: "h2oMassG",
      label: "H₂O mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description:
        "Mole ratios relative to the smallest value, rounded to two decimals.",
      id: "ratios",
      label: "C and H ratios",
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
    const ratio = (value: number): number =>
      Math.round((value / smallest) * 100) / 100;
    return { ratios: { C: ratio(molesC), H: ratio(molesH) } };
  },
});
export const runEmpiricalFormulaCombustion =
  empiricalFormulaCombustionTool.execute;
export default empiricalFormulaCombustionTool;

export type EmpiricalFormulaCombustionInput = {
  readonly co2MassG: number;
  readonly h2oMassG: number;
};

export type EmpiricalFormulaCombustionOutput = {
  readonly ratios: Record<string, unknown>;
};

export const empiricalFormulaCombustionExample = {
  input: {
    co2MassG: 1,
    h2oMassG: 1,
  },
  output: {
    ratios: {
      C: 1,
      H: 4.89,
    },
  },
} satisfies ToolExample<
  EmpiricalFormulaCombustionInput,
  EmpiricalFormulaCombustionOutput
>;
