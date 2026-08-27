import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterUseEfficiencyInput = {
  readonly netPhotosynthesisUmolPerM2S: number;
  readonly transpirationMmolPerM2S: number;
};

export type WaterUseEfficiencyOutput = {
  readonly waterUseEfficiency: number;
};

export const waterUseEfficiencyExample = {
  input: { netPhotosynthesisUmolPerM2S: 200, transpirationMmolPerM2S: 40 },
  output: { waterUseEfficiency: 5 },
} satisfies ToolExample<WaterUseEfficiencyInput, WaterUseEfficiencyOutput>;

export const waterUseEfficiencyTool = createSimpleTool({
  id: "biology/water-use-efficiency",
  title: "WUE Calculator",
  description:
    "Compute intrinsic water use efficiency as net photosynthesis in micromoles per square metre per second divided by transpiration in millimoles per square metre per second.",
  inputs: [
    {
      id: "netPhotosynthesisUmolPerM2S",
      kind: "number",
      label: "Net photosynthesis",
      minimum: 0,
      unit: "µmol/m²/s",
    },
    {
      id: "transpirationMmolPerM2S",
      kind: "number",
      label: "Transpiration",
      unit: "mmol/m²/s",
    },
  ],
  outputs: [
    {
      id: "waterUseEfficiency",
      kind: "number",
      label: "Water use efficiency",
      unit: "µmol/mmol",
    },
  ],
  calculate: (input) => {
    const transpirationMmolPerM2S = input.transpirationMmolPerM2S as number;
    if (!(transpirationMmolPerM2S > 0))
      simpleError(
        "transpirationMmolPerM2S",
        "The transpiration rate must be greater than zero.",
      );
    return {
      waterUseEfficiency:
        (input.netPhotosynthesisUmolPerM2S as number) / transpirationMmolPerM2S,
    };
  },
});
export const runWaterUseEfficiency = waterUseEfficiencyTool.execute;
export default waterUseEfficiencyTool;
