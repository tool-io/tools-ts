import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntrinsicWaterUseEfficiencyInput = {
  readonly netPhotosynthesisUmolM2S: number;
  readonly stomatalConductanceMolM2S: number;
};

export type IntrinsicWaterUseEfficiencyOutput = {
  readonly intrinsicWaterUseEfficiency: number;
};

export const intrinsicWaterUseEfficiencyExample = {
  input: { netPhotosynthesisUmolM2S: 15, stomatalConductanceMolM2S: 0.25 },
  output: { intrinsicWaterUseEfficiency: 60 },
} satisfies ToolExample<
  IntrinsicWaterUseEfficiencyInput,
  IntrinsicWaterUseEfficiencyOutput
>;

export const intrinsicWaterUseEfficiencyTool = createSimpleTool({
  id: "biology/water-use-efficiency-intrinsic",
  title: "Intrinsic WUE",
  description:
    "Compute intrinsic water use efficiency in micromoles per millimole as the net photosynthesis rate divided by the stomatal conductance.",
  inputs: [
    {
      id: "netPhotosynthesisUmolM2S",
      kind: "number",
      label: "Net photosynthesis",
      minimum: 0,
      unit: "µmol/m²/s",
    },
    {
      id: "stomatalConductanceMolM2S",
      kind: "number",
      label: "Stomatal conductance",
      minimum: 0,
      unit: "mol/m²/s",
    },
  ],
  outputs: [
    {
      id: "intrinsicWaterUseEfficiency",
      kind: "number",
      label: "Intrinsic water use efficiency",
      unit: "µmol/mmol",
    },
  ],
  calculate: (input) => {
    const netPhotosynthesisUmolM2S = input.netPhotosynthesisUmolM2S as number;
    const stomatalConductanceMolM2S = input.stomatalConductanceMolM2S as number;
    if (!(stomatalConductanceMolM2S > 0))
      simpleError(
        "stomatalConductanceMolM2S",
        "The stomatal conductance must be greater than zero.",
      );
    return {
      intrinsicWaterUseEfficiency:
        netPhotosynthesisUmolM2S / stomatalConductanceMolM2S,
    };
  },
});
export const runIntrinsicWaterUseEfficiency =
  intrinsicWaterUseEfficiencyTool.execute;
export default intrinsicWaterUseEfficiencyTool;
