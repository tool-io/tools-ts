import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SigeStrainInput = {
  readonly germaniumFractionX: number;
};

export type SigeStrainOutput = {
  readonly strainPercent: number;
};

export const sigeStrainExample = {
  input: { germaniumFractionX: 0.2 },
  output: { strainPercent: -0.8290117595500672 },
} satisfies ToolExample<SigeStrainInput, SigeStrainOutput>;

export const sigeStrainTool = createSimpleTool({
  calculate: (input) => {
    const relaxedLatticeAngstrom =
      5.431 + (input.germaniumFractionX as number) * (5.658 - 5.431);
    return {
      strainPercent:
        relaxedLatticeAngstrom === 5.431
          ? 0
          : ((5.431 - relaxedLatticeAngstrom) / relaxedLatticeAngstrom) * 100,
    };
  },
  description:
    "Compute in-plane compressive strain of a fully pseudomorphic SiGe layer on silicon relative to the relaxed SiGe lattice constant from Vegard's law.",
  id: "semiconductor/sige-strain",
  inputs: [
    {
      id: "germaniumFractionX",
      kind: "number",
      label: "Germanium fraction x",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "strainPercent",
      kind: "number",
      label: "Pseudomorphic strain",
      unit: "%",
    },
  ],
  title: "Pseudomorphic SiGe Strain Calculator",
});
export const runSigeStrain = sigeStrainTool.execute;
export default sigeStrainTool;
