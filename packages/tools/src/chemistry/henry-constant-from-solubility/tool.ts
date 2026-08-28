import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const henryConstantFromSolubilityTool = createSimpleTool({
  id: "chemistry/henry-constant-from-solubility",
  title: "Henry Constant From Solubility Calculator",
  description:
    "Derive Henry's law constant H = P / C from the partial pressure and dissolved gas concentration at equilibrium.",
  inputs: [
    {
      description: "Partial pressure of the gas above the liquid.",
      id: "partialPressureAtm",
      label: "Partial pressure",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
    {
      description:
        "Dissolved gas concentration at equilibrium; must be greater than zero.",
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description: "Henry's law constant in atm·L/mol.",
      id: "henryConstantAtmLPerMol",
      label: "Henry constant",
      kind: "number",
      unit: "atm·L/mol",
    },
  ],
  calculate: (input) => {
    const concentration = input.concentrationMolL as number;
    if (concentration <= 0)
      simpleError(
        "concentrationMolL",
        "The dissolved gas concentration must be greater than zero.",
        "invalid_concentration",
      );
    return {
      henryConstantAtmLPerMol:
        (input.partialPressureAtm as number) / concentration,
    };
  },
});
export const runHenryConstantFromSolubility =
  henryConstantFromSolubilityTool.execute;
export default henryConstantFromSolubilityTool;

export type HenryConstantFromSolubilityInput = {
  readonly partialPressureAtm: number;
  readonly concentrationMolL: number;
};

export type HenryConstantFromSolubilityOutput = {
  readonly henryConstantAtmLPerMol: number;
};

export const henryConstantFromSolubilityExample = {
  input: {
    partialPressureAtm: 1,
    concentrationMolL: 1,
  },
  output: {
    henryConstantAtmLPerMol: 1,
  },
} satisfies ToolExample<
  HenryConstantFromSolubilityInput,
  HenryConstantFromSolubilityOutput
>;
