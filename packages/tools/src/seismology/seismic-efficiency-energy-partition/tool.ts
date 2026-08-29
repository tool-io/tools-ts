import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const seismicEfficiencyEnergyPartitionExample = {
  input: {
    radiatedEnergyJ: 17500000000,
    seismicMomentNm: 35000000000000000,
    stressDropPa: 3000000,
    rigidityPa: 30000000000,
  },
  output: { efficiencyPercent: 1, totalEnergyJ: 1750000000000 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const seismicEfficiencyEnergyPartitionTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ radiatedEnergyJ, seismicMomentNm, stressDropPa, rigidityPa }) => {
      if (!(seismicMomentNm > 0))
        simpleError("seismicMomentNm", "Seismic moment must be positive.");
      if (!(stressDropPa > 0))
        simpleError("stressDropPa", "Stress drop must be positive.");
      if (!(rigidityPa > 0))
        simpleError("rigidityPa", "Rigidity must be positive.");
      const totalEnergyJ = (stressDropPa / (2 * rigidityPa)) * seismicMomentNm;
      return {
        efficiencyPercent: (radiatedEnergyJ / totalEnergyJ) * 100,
        totalEnergyJ,
      };
    })(input as never) as Record<string, unknown>,
  description: "Seismic efficiency η = Es / E_total with E_total = (Δσ/2μ)·M₀.",
  id: "seismology/seismic-efficiency-energy-partition",
  inputs: [
    {
      minimum: 0,
      description: "Radiated seismic energy.",
      id: "radiatedEnergyJ",
      kind: "number",
      label: "Es",
      unit: "J",
    },
    {
      minimum: 0,
      description: "Seismic moment.",
      id: "seismicMomentNm",
      kind: "number",
      label: "M₀",
      unit: "N·m",
    },
    {
      default: 3000000,
      description: "Stress drop.",
      id: "stressDropPa",
      kind: "number",
      label: "Δσ",
      unit: "Pa",
    },
    {
      default: 30000000000,
      description: "Rigidity.",
      id: "rigidityPa",
      kind: "number",
      label: "μ",
      unit: "Pa",
    },
  ],
  outputs: [
    {
      description: "Fraction of released energy radiated.",
      id: "efficiencyPercent",
      kind: "number",
      label: "η%",
      unit: "%",
    },
    {
      description: "Estimated total released energy.",
      id: "totalEnergyJ",
      kind: "number",
      label: "E_tot",
      unit: "J",
    },
  ],
  title: "Seismic Efficiency Energy Partition Calculator",
});
export const runSeismicEfficiencyEnergyPartition =
  seismicEfficiencyEnergyPartitionTool.execute;
export { seismicEfficiencyEnergyPartitionExample as example };
export default seismicEfficiencyEnergyPartitionTool;
