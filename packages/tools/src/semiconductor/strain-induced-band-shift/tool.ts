import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrainInducedBandShiftInput = {
  readonly conductionBandDeformationPotentialEv: number;
  readonly normalStrain: number;
  readonly parallelStrain: number;
};

export type StrainInducedBandShiftOutput = {
  readonly bandEdgeShiftMeV: number;
};

export const strainInducedBandShiftExample = {
  input: {
    conductionBandDeformationPotentialEv: -5.17,
    normalStrain: -0.01,
    parallelStrain: 0.01,
  },
  output: { bandEdgeShiftMeV: -51.7 },
} satisfies ToolExample<
  StrainInducedBandShiftInput,
  StrainInducedBandShiftOutput
>;

export const strainInducedBandShiftTool = createSimpleTool({
  calculate: (input) => {
    const bandEdgeShiftMeV =
      (input.conductionBandDeformationPotentialEv as number) *
      (2 * (input.parallelStrain as number) + (input.normalStrain as number)) *
      1000;
    if (!Number.isFinite(bandEdgeShiftMeV))
      simpleError("parallelStrain", "Calculated band shift is not finite.");
    return { bandEdgeShiftMeV };
  },
  description:
    "Calculate the hydrostatic conduction-band shift from a deformation potential and the trace of a biaxial strain tensor; shear-induced valley splitting is not included.",
  id: "semiconductor/strain-induced-band-shift",
  inputs: [
    { id: "parallelStrain", kind: "number", label: "Parallel strain" },
    { id: "normalStrain", kind: "number", label: "Normal strain" },
    {
      id: "conductionBandDeformationPotentialEv",
      kind: "number",
      label: "Conduction-band deformation potential",
      unit: "eV",
    },
  ],
  outputs: [
    {
      id: "bandEdgeShiftMeV",
      kind: "number",
      label: "Hydrostatic band edge shift",
      unit: "meV",
    },
  ],
  title: "Strain Band Shift Calculator",
});
export const runStrainInducedBandShift = strainInducedBandShiftTool.execute;
export default strainInducedBandShiftTool;
