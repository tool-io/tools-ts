import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const heatCapacityRatioGammaExample = {
  input: { cvJPerMolK: 20.79, cpJPerMolK: 29.1 },
  output: { heatCapacityRatioGamma: 1.3997113997114 },
} satisfies ToolExample<
  {
    readonly cvJPerMolK: number;
    readonly cpJPerMolK: number;
  },
  { readonly heatCapacityRatioGamma: number }
>;

export const heatCapacityRatioGammaTool = createSimpleTool({
  id: "chemistry/heat-capacity-ratio-gamma",
  title: "Gamma Heat Capacity Ratio",
  description:
    "Compute the adiabatic index gamma as the ratio of molar heat capacity at constant pressure to that at constant volume.",
  inputs: [
    {
      id: "cpJPerMolK",
      label: "Heat capacity Cp",
      kind: "number",
      unit: "J/(mol·K)",
    },
    {
      id: "cvJPerMolK",
      label: "Heat capacity Cv",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  outputs: [
    {
      id: "heatCapacityRatioGamma",
      label: "Heat capacity ratio gamma",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const cpJPerMolK = input.cpJPerMolK as number;
    const cvJPerMolK = input.cvJPerMolK as number;
    if (!(cpJPerMolK > 0))
      simpleError("cpJPerMolK", "Heat capacity Cp must be positive.");
    if (!(cvJPerMolK > 0))
      simpleError("cvJPerMolK", "Heat capacity Cv must be positive.");
    return { heatCapacityRatioGamma: cpJPerMolK / cvJPerMolK };
  },
});
export const runHeatCapacityRatioGamma = heatCapacityRatioGammaTool.execute;
export default heatCapacityRatioGammaTool;
