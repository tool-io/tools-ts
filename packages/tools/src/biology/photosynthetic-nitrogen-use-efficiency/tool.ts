import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotosyntheticNitrogenUseEfficiencyInput = {
  readonly leafNitrogenGM2: number;
  readonly netPhotosynthesisUmolM2S: number;
};

export type PhotosyntheticNitrogenUseEfficiencyOutput = {
  readonly photosyntheticNitrogenUseEfficiency: number;
};

export const photosyntheticNitrogenUseEfficiencyExample = {
  input: { leafNitrogenGM2: 1.2, netPhotosynthesisUmolM2S: 18 },
  output: { photosyntheticNitrogenUseEfficiency: 15 },
} satisfies ToolExample<
  PhotosyntheticNitrogenUseEfficiencyInput,
  PhotosyntheticNitrogenUseEfficiencyOutput
>;

export const photosyntheticNitrogenUseEfficiencyTool = createSimpleTool({
  id: "biology/photosynthetic-nitrogen-use-efficiency",
  title: "PNUE",
  description:
    "Compute photosynthetic nitrogen use efficiency PNUE in micromoles per mole as the net photosynthesis rate divided by the leaf nitrogen per unit area.",
  inputs: [
    {
      id: "netPhotosynthesisUmolM2S",
      kind: "number",
      label: "Net photosynthesis",
      minimum: 0,
      unit: "µmol/m²/s",
    },
    {
      id: "leafNitrogenGM2",
      kind: "number",
      label: "Leaf nitrogen per area",
      minimum: 0,
      unit: "g/m²",
    },
  ],
  outputs: [
    {
      id: "photosyntheticNitrogenUseEfficiency",
      kind: "number",
      label: "Photosynthetic nitrogen use efficiency",
      unit: "µmol/mol",
    },
  ],
  calculate: (input) => {
    const netPhotosynthesisUmolM2S = input.netPhotosynthesisUmolM2S as number;
    const leafNitrogenGM2 = input.leafNitrogenGM2 as number;
    if (!(leafNitrogenGM2 > 0))
      simpleError(
        "leafNitrogenGM2",
        "The leaf nitrogen per area must be greater than zero.",
      );
    return {
      photosyntheticNitrogenUseEfficiency:
        netPhotosynthesisUmolM2S / leafNitrogenGM2,
    };
  },
});
export const runPhotosyntheticNitrogenUseEfficiency =
  photosyntheticNitrogenUseEfficiencyTool.execute;
export default photosyntheticNitrogenUseEfficiencyTool;
