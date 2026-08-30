import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly electronLorentzFactor: number;
  readonly incidentPhotonEnergyEv: number;
}>;
export type Output = Readonly<{
  readonly backscatteredPhotonEnergyEv: number;
}>;

export const calculate = (input: Input): Output => {
  return {
    backscatteredPhotonEnergyEv:
      4 * input.electronLorentzFactor ** 2 * input.incidentPhotonEnergyEv,
  };
};

export const exampleInput = {
  electronLorentzFactor: 100,
  incidentPhotonEnergyEv: 1,
} satisfies Input;
export const exampleOutput = {
  backscatteredPhotonEnergyEv: 40000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      electronLorentzFactor: input.electronLorentzFactor as number,
      incidentPhotonEnergyEv: input.incidentPhotonEnergyEv as number,
    }),
  description:
    "Estimate low-recoil head-on inverse-Compton backscatter photon energy as 4γ²E.",
  id: "laser/inverse-compton-photon-energy",
  inputs: [
    {
      id: "electronLorentzFactor",
      label: "Electron Lorentz factor",
      kind: "number",
      minimum: 1,
    },
    {
      id: "incidentPhotonEnergyEv",
      label: "Incident photon energy",
      kind: "number",
      minimum: 0,
      unit: "eV",
    },
  ],
  outputs: [
    {
      id: "backscatteredPhotonEnergyEv",
      label: "Head-on backscatter photon energy",
      kind: "number",
      minimum: 0,
      unit: "eV",
    },
  ],
  title: "Inverse-Compton Photon Energy",
});

export const run = tool.execute;
export default tool;
