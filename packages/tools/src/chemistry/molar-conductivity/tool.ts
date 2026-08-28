import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const MolarConductivityTool = createSimpleTool({
  id: "chemistry/molar-conductivity",
  title: "Molar Conductivity Calculator",
  description: "Compute molar conductivity lambda = kappa * 1000 / c.",
  inputs: [
    {
      id: "conductivitySCm",
      label: "Kappa",
      kind: "number",
      minimum: 0,
      unit: "S/cm",
    },
    {
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      id: "molarConductivitySCm2Mol",
      label: "Lambda m",
      kind: "number",
      unit: "S*cm2/mol",
    },
  ],
  calculate: (input) => {
    const c = input.concentrationMolL as number;
    if (c <= 0) simpleError("concentrationMolL", "> 0 required.", "invalid_c");
    return {
      molarConductivitySCm2Mol: ((input.conductivitySCm as number) * 1000) / c,
    };
  },
});
export default MolarConductivityTool;
export const runMolarConductivity = MolarConductivityTool.execute;

export type MolarConductivityInput = {
  readonly conductivitySCm: number;
  readonly concentrationMolL: number;
};

export type MolarConductivityOutput = {
  readonly molarConductivitySCm2Mol: number;
};

export const molarConductivityExample = {
  input: {
    conductivitySCm: 1,
    concentrationMolL: 1,
  },
  output: {
    molarConductivitySCm2Mol: 1000,
  },
} satisfies ToolExample<MolarConductivityInput, MolarConductivityOutput>;
