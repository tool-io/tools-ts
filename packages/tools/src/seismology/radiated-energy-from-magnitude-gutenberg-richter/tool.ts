import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const radiatedEnergyFromMagnitudeGutenbergRichterExample = {
  input: { magnitudeMw: 6 },
  output: {
    radiatedEnergyJ: 63095734448019.43,
    energyPerMagnitudeStepRatio: 31.622776601683793,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const radiatedEnergyFromMagnitudeGutenbergRichterTool = createSimpleTool(
  {
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ magnitudeMw }) => ({
        radiatedEnergyJ: Math.pow(10, 1.5 * magnitudeMw + 4.8),
        energyPerMagnitudeStepRatio: Math.pow(10, 1.5),
      }))(input as never) as Record<string, unknown>,
    description: "Gutenberg-Richter energy relation log₁₀Es(J) = 1.5·M + 4.8.",
    id: "seismology/radiated-energy-from-magnitude-gutenberg-richter",
    inputs: [
      {
        description: "Magnitude.",
        id: "magnitudeMw",
        kind: "number",
        label: "M",
      },
    ],
    outputs: [
      {
        description: "Radiated seismic energy.",
        id: "radiatedEnergyJ",
        kind: "number",
        label: "Es",
        unit: "J",
      },
      {
        description: "Energy ratio per unit magnitude.",
        id: "energyPerMagnitudeStepRatio",
        kind: "number",
        label: "×31.6",
      },
    ],
    title: "Radiated Energy From Magnitude Gutenberg Richter",
  },
);
export const runRadiatedEnergyFromMagnitudeGutenbergRichter =
  radiatedEnergyFromMagnitudeGutenbergRichterTool.execute;
export { radiatedEnergyFromMagnitudeGutenbergRichterExample as example };
export default radiatedEnergyFromMagnitudeGutenbergRichterTool;
