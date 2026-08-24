import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaserSlopeEfficiencyInput = {
  readonly differentialQuantumEfficiencyPercent: number;
  readonly photonEnergyEv: number;
};

export type LaserSlopeEfficiencyOutput = {
  readonly slopeEfficiencyWPerA: number;
};

export const laserSlopeEfficiencyExample = {
  input: {
    differentialQuantumEfficiencyPercent: 50,
    photonEnergyEv: 1.2,
  },
  output: { slopeEfficiencyWPerA: 0.6 },
} satisfies ToolExample<LaserSlopeEfficiencyInput, LaserSlopeEfficiencyOutput>;

export const laserSlopeEfficiencyTool = createSimpleTool({
  id: "semiconductor/laser-slope-efficiency",
  title: "Laser Slope Efficiency Calculator",
  description:
    "Compute laser slope efficiency in watts per ampere from differential quantum efficiency and photon energy, where W/A numerically equals the efficiency fraction times photon energy in electronvolts.",
  inputs: [
    {
      description: "Differential quantum efficiency above threshold.",
      id: "differentialQuantumEfficiencyPercent",
      kind: "number",
      label: "Differential quantum efficiency",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Photon energy of the emitted light.",
      id: "photonEnergyEv",
      kind: "number",
      label: "Photon energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
  ],
  outputs: [
    {
      description: "Increase in optical output power per increase in current.",
      format: "slope",
      id: "slopeEfficiencyWPerA",
      kind: "number",
      label: "Slope efficiency",
      minimum: 0,
      unit: "W/A",
    },
  ],
  calculate: (input) => {
    const percent = input.differentialQuantumEfficiencyPercent as number;
    const photonEnergyEv = input.photonEnergyEv as number;
    if (!(photonEnergyEv > 0))
      simpleError(
        "photonEnergyEv",
        "Photon energy must be positive.",
        "invalid_energy",
      );
    return {
      slopeEfficiencyWPerA: (percent / 100) * photonEnergyEv,
    };
  },
});
export const runLaserSlopeEfficiency = laserSlopeEfficiencyTool.execute;
export default laserSlopeEfficiencyTool;
