import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FreeSo2TargetDoseInput = {
  readonly currentFreeSo2MgPerL: number;
  readonly ph: number;
  readonly targetMolecularMgPerL: number;
};

export type FreeSo2TargetDoseOutput = {
  readonly additionalDoseMgPerL: number;
  readonly requiredFreeSo2MgPerL: number;
};

export const freeSo2TargetDoseExample = {
  input: {
    currentFreeSo2MgPerL: 20,
    ph: 3.2,
    targetMolecularMgPerL: 0.8,
  },
  output: {
    additionalDoseMgPerL: 0.43767132548,
    requiredFreeSo2MgPerL: 20.4376713255,
  },
} satisfies ToolExample<FreeSo2TargetDoseInput, FreeSo2TargetDoseOutput>;

const SO2_PKA = 1.81;

export const calculateFreeSo2TargetDose = (
  input: FreeSo2TargetDoseInput,
): FreeSo2TargetDoseOutput => {
  const molecularFraction = 1 / (1 + 10 ** (input.ph - SO2_PKA));
  const required = input.targetMolecularMgPerL / molecularFraction;
  return {
    additionalDoseMgPerL: roundStatistic(
      Math.max(0, required - input.currentFreeSo2MgPerL),
    ),
    requiredFreeSo2MgPerL: roundStatistic(required),
  };
};

export const freeSo2TargetDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateFreeSo2TargetDose(input as unknown as FreeSo2TargetDoseInput),
  description:
    "Calculate the equilibrium free-SO2 level corresponding to a caller-selected molecular SO2 target at the measured pH and the shortfall from current free SO2; actual additive dose must account for binding.",
  id: "oenology/free-so2-target-dose",
  inputs: [
    {
      description: "Free SO2 measured in the wine now.",
      id: "currentFreeSo2MgPerL",
      kind: "number",
      label: "Current free SO2",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Measured pH of the wine.",
      id: "ph",
      label: "pH",
      kind: "number",
      maximum: 14,
      minimum: 0,
    },
    {
      description: "Molecular SO2 target selected for the wine and objective.",
      id: "targetMolecularMgPerL",
      kind: "number",
      label: "Target molecular SO2",
      minimum: 0,
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      description:
        "Increase in measured free SO2 needed, not additive product mass.",
      id: "additionalDoseMgPerL",
      kind: "number",
      label: "Additional dose",
      unit: "mg/L",
    },
    {
      description: "Total free SO2 required for the molecular target.",
      id: "requiredFreeSo2MgPerL",
      kind: "number",
      label: "Required free SO2",
      unit: "mg/L",
    },
  ],
  title: "Target Free SO2 Dose Calculator",
});
export const runFreeSo2TargetDose = freeSo2TargetDoseTool.execute;
export default freeSo2TargetDoseTool;
