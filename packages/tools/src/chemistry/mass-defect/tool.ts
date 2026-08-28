import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const massDefectTool = createSimpleTool({
  id: "chemistry/mass-defect",
  title: "Mass Defect Calculator",
  description:
    "Compute the nuclear mass defect Δm = Z·m(H) + N·m(n) − measured atomic mass.",
  inputs: [
    {
      description: "Number of protons (hydrogen atoms contributed).",
      id: "protons",
      label: "Protons",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Number of neutrons.",
      id: "neutrons",
      label: "Neutrons",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Measured atomic mass of the nuclide.",
      id: "actualAtomicMassU",
      label: "Actual mass",
      kind: "number",
      unit: "u",
    },
  ],
  outputs: [
    {
      description: "Mass defect in atomic mass units.",
      id: "massDefectU",
      label: "Mass defect",
      kind: "number",
      unit: "u",
    },
  ],
  calculate: (input) => {
    const protonMassU = 1.007825;
    const neutronMassU = 1.008665;
    const predicted =
      (input.protons as number) * protonMassU +
      (input.neutrons as number) * neutronMassU;
    return { massDefectU: predicted - (input.actualAtomicMassU as number) };
  },
});
export const runMassDefect = massDefectTool.execute;
export default massDefectTool;

export type MassDefectInput = {
  readonly protons: number;
  readonly neutrons: number;
  readonly actualAtomicMassU: number;
};

export type MassDefectOutput = {
  readonly massDefectU: number;
};

export const massDefectExample = {
  input: {
    protons: 1,
    neutrons: 1,
    actualAtomicMassU: 1,
  },
  output: {
    massDefectU: 1.0164900000000001,
  },
} satisfies ToolExample<MassDefectInput, MassDefectOutput>;
