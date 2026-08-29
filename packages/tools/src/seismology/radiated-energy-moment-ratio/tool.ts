import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const radiatedEnergyMomentRatioExample = {
  input: {
    radiatedEnergyJ: 15000000000000,
    seismicMomentNm: 35000000000000000,
  },
  output: { energyMomentRatio: 0.00042857142857142855 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const radiatedEnergyMomentRatioTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ radiatedEnergyJ, seismicMomentNm }) => {
      if (seismicMomentNm <= 0)
        simpleError("seismicMomentNm", "M₀ must be positive.");
      return { energyMomentRatio: radiatedEnergyJ / seismicMomentNm };
    })(input as never) as Record<string, unknown>,
  description:
    "Dimensionless ratio of radiated seismic energy to seismic moment.",
  id: "seismology/radiated-energy-moment-ratio",
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
  ],
  outputs: [
    {
      description: "Dimensionless ratio.",
      id: "energyMomentRatio",
      kind: "number",
      label: "Es/M₀",
    },
  ],
  title: "Radiated Energy Moment Ratio Calculator",
});
export const runRadiatedEnergyMomentRatio =
  radiatedEnergyMomentRatioTool.execute;
export { radiatedEnergyMomentRatioExample as example };
export default radiatedEnergyMomentRatioTool;
