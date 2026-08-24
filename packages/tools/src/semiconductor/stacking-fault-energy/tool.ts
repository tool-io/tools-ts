import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StackingFaultEnergyInput = {
  readonly faultEnergyEvPerAtom: number;
  readonly atomDensityPerNm2: number;
};

export type StackingFaultEnergyOutput = {
  readonly stackingFaultEnergyMilliJPerM2: number;
};

const EV_PER_NM2_TO_MJ_PER_M2 = 160.2176634;

export const stackingFaultEnergyExample = {
  input: { atomDensityPerNm2: 7.8, faultEnergyEvPerAtom: 0.02 },
  output: { stackingFaultEnergyMilliJPerM2: 24.993955490399998 },
} satisfies ToolExample<StackingFaultEnergyInput, StackingFaultEnergyOutput>;

export const stackingFaultEnergyTool = createSimpleTool({
  id: "semiconductor/stacking-fault-energy",
  title: "Stacking Fault Energy Calculator",
  description:
    "Calculate the stacking fault energy per unit area from the fault energy per atom and the atomic surface density.",
  inputs: [
    {
      description: "Stacking fault formation energy per atom.",
      id: "faultEnergyEvPerAtom",
      kind: "number",
      label: "Fault energy per atom",
      minimum: 0,
      unit: "eV",
    },
    {
      description: "Atomic density on the fault plane.",
      id: "atomDensityPerNm2",
      kind: "number",
      label: "Atom density",
      unit: "1/nm²",
    },
  ],
  outputs: [
    {
      description: "Stacking fault energy per unit area.",
      id: "stackingFaultEnergyMilliJPerM2",
      kind: "number",
      label: "Stacking fault energy",
      unit: "mJ/m²",
    },
  ],
  calculate: (input) => {
    const faultEnergyEvPerAtom = input.faultEnergyEvPerAtom as number;
    const atomDensityPerNm2 = input.atomDensityPerNm2 as number;
    if (!(atomDensityPerNm2 > 0))
      simpleError(
        "atomDensityPerNm2",
        "Atom density must be positive.",
        "must_be_positive",
      );
    return {
      stackingFaultEnergyMilliJPerM2:
        faultEnergyEvPerAtom * atomDensityPerNm2 * EV_PER_NM2_TO_MJ_PER_M2,
    };
  },
});
export const runStackingFaultEnergy = stackingFaultEnergyTool.execute;
export default stackingFaultEnergyTool;
