import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const ConductivityFromConcentrationTool = createSimpleTool({
  id: "chemistry/conductivity-from-concentration",
  title: "Conductivity From Concentration Calculator",
  description:
    "Compute conductivity kappa = molarConductivity * concentration / 1000.",
  inputs: [
    {
      id: "molarConductivitySCm2Mol",
      label: "Lambda m",
      kind: "number",
      minimum: 0,
      unit: "S*cm2/mol",
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
      id: "conductivitySCm",
      label: "Conductivity",
      kind: "number",
      unit: "S/cm",
    },
  ],
  calculate: (input) => {
    return {
      conductivitySCm:
        ((input.molarConductivitySCm2Mol as number) *
          (input.concentrationMolL as number)) /
        1000,
    };
  },
});
export default ConductivityFromConcentrationTool;
export const runConductivityFromConcentration =
  ConductivityFromConcentrationTool.execute;

export type ConductivityFromConcentrationInput = {
  readonly molarConductivitySCm2Mol: number;
  readonly concentrationMolL: number;
};

export type ConductivityFromConcentrationOutput = {
  readonly conductivitySCm: number;
};

export const conductivityFromConcentrationExample = {
  input: {
    molarConductivitySCm2Mol: 1,
    concentrationMolL: 1,
  },
  output: {
    conductivitySCm: 0.001,
  },
} satisfies ToolExample<
  ConductivityFromConcentrationInput,
  ConductivityFromConcentrationOutput
>;
