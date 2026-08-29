import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const apparentStressEnergyRatioExample = {
  input: {
    radiatedEnergyJ: 15000000000000,
    seismicMomentNm: 35000000000000000,
  },
  output: { apparentStressMPa: 12.857142857142856 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const apparentStressEnergyRatioTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ radiatedEnergyJ, seismicMomentNm, rigidityPa }) => {
      if (!(seismicMomentNm > 0))
        simpleError("seismicMomentNm", "Seismic moment must be positive.");
      if (!(rigidityPa > 0))
        simpleError("rigidityPa", "Rigidity must be positive.");
      return {
        apparentStressMPa:
          (rigidityPa * radiatedEnergyJ) / seismicMomentNm / 1e6,
      };
    })(input as never) as Record<string, unknown>,
  description: "Apparent stress σ_app = μ · Es / M₀ in megapascals.",
  id: "seismology/apparent-stress-energy-ratio",
  inputs: [
    {
      minimum: 0,
      description: "Radiated energy.",
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
      default: 30000000000,
      minimum: 0,
      description: "Shear rigidity.",
      id: "rigidityPa",
      kind: "number",
      label: "μ",
      unit: "Pa",
    },
  ],
  outputs: [
    {
      description: "Apparent stress.",
      id: "apparentStressMPa",
      kind: "number",
      label: "σ_app",
      unit: "MPa",
    },
  ],
  title: "Apparent Stress Energy Ratio Calculator",
});
export const runApparentStressEnergyRatio =
  apparentStressEnergyRatioTool.execute;
export { apparentStressEnergyRatioExample as example };
export default apparentStressEnergyRatioTool;
