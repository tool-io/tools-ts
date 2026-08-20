import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ElectronMobilityInput = {
  readonly donorConcentrationPerCm3: number;
};

export type ElectronMobilityOutput = {
  readonly mobilityCm2PerVs: number;
};

/** Silicon Caughey-Thomas low-field parameters at 300 K. */
const MU_MIN = 92;
const MU_MAX = 1268;
const N_REFERENCE = 1.3e17;
const ALPHA = 0.91;

export const electronMobilityExample = {
  input: { donorConcentrationPerCm3: 1e16 },
  output: { mobilityCm2PerVs: 1164.11498308 },
} satisfies ToolExample<ElectronMobilityInput, ElectronMobilityOutput>;

export const calculateElectronMobility = (
  input: ElectronMobilityInput,
): ElectronMobilityOutput => {
  const doping = input.donorConcentrationPerCm3;
  if (doping <= 0)
    simpleError(
      "donorConcentrationPerCm3",
      "Doping must be positive.",
      "invalid_doping",
    );
  const mobility =
    MU_MIN + (MU_MAX - MU_MIN) / (1 + (doping / N_REFERENCE) ** ALPHA);
  return { mobilityCm2PerVs: roundStatistic(mobility) };
};

export const electronMobilityTool = createSimpleTool({
  calculate: (input) =>
    calculateElectronMobility(
      input as unknown as ElectronMobilityInput,
    ),
  description:
    "Compute the silicon electron low-field mobility versus donor doping at 300 K (Caughey-Thomas).",
  id: "semiconductor/electron-mobility",
  inputs: [
    {
      description: "Donor doping concentration.",
      format: "density-per-cm3",
      id: "donorConcentrationPerCm3",
      kind: "number",
      label: "Nd",
      unit: "cm^-3",
    },
  ],
  outputs: [
    {
      description: "Electron mobility.",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Electron mobility",
      unit: "cm^2/Vs",
    },
  ],
  title: "Electron Mobility Calculator",
});
export const runElectronMobility = electronMobilityTool.execute;
export default electronMobilityTool;
