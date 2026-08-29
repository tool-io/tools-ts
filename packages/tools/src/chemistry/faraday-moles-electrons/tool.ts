import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const faradayMolesElectronsTool = createSimpleTool({
  id: "chemistry/faraday-moles-electrons",
  title: "Faraday Moles of Electrons Calculator",
  description:
    "Convert total electric charge into moles of electrons using Faraday's constant (96485 C/mol).",
  inputs: [
    {
      description: "Total charge passed through the cell.",
      id: "chargeCoulombs",
      label: "Charge",
      kind: "number",
      minimum: 0,
      unit: "C",
    },
  ],
  outputs: [
    {
      description: "Moles of electrons transferred.",
      id: "molesElectrons",
      label: "Moles of electrons",
      kind: "number",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    return { molesElectrons: (input.chargeCoulombs as number) / 96485.33212 };
  },
});
export const runFaradayMolesElectrons = faradayMolesElectronsTool.execute;
export default faradayMolesElectronsTool;

export type FaradayMolesElectronsInput = {
  readonly chargeCoulombs: number;
};

export type FaradayMolesElectronsOutput = {
  readonly molesElectrons: number;
};

export const faradayMolesElectronsExample = {
  input: {
    chargeCoulombs: 1,
  },
  output: {
    molesElectrons: 0.000010364269656617728,
  },
} satisfies ToolExample<
  FaradayMolesElectronsInput,
  FaradayMolesElectronsOutput
>;
