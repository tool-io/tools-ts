import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ic50ToKiTool = createSimpleTool({
  id: "chemistry/ic50-to-ki",
  title: "IC50 to Ki Converter",
  description:
    "Convert IC50 to Ki using Cheng-Prusoff equation Ki = IC50/(1+[S]/Km).",
  inputs: [
    {
      id: "ic50MolL",
      label: "IC50",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      id: "substrateKmMolL",
      label: "Km",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      id: "substrateConcMolL",
      label: "[S]",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [{ id: "kiMolL", label: "Ki", kind: "number", unit: "mol/L" }],
  calculate: (input) => {
    const km = input.substrateKmMolL as number;
    if (!(km > 0))
      simpleError(
        "substrateKmMolL",
        "Km must be greater than zero.",
        "invalid_km",
      );
    const denominator = 1 + (input.substrateConcMolL as number) / km;
    return { kiMolL: (input.ic50MolL as number) / denominator };
  },
});
export default ic50ToKiTool;
export const runIc50ToKi = ic50ToKiTool.execute;

export type Ic50ToKiInput = {
  readonly ic50MolL: number;
  readonly substrateKmMolL: number;
  readonly substrateConcMolL: number;
};

export type Ic50ToKiOutput = {
  readonly kiMolL: number;
};

export const ic50ToKiExample = {
  input: {
    ic50MolL: 1,
    substrateKmMolL: 1,
    substrateConcMolL: 1,
  },
  output: {
    kiMolL: 0.5,
  },
} satisfies ToolExample<Ic50ToKiInput, Ic50ToKiOutput>;
