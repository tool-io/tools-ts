import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const bindingEnergyPerNucleonTool = createSimpleTool({
  id: "chemistry/binding-energy-per-nucleon",
  title: "Binding Energy Per Nucleon Calculator",
  description:
    "Convert a mass defect into total binding energy and divide by the nucleon count using 931.494 MeV per atomic mass unit.",
  inputs: [
    {
      description: "Mass defect of the nuclide.",
      id: "massDefectU",
      label: "Mass defect",
      kind: "number",
      minimum: 0,
      unit: "u",
    },
    {
      description:
        "Total nucleons (protons plus neutrons); must be greater than zero.",
      id: "nucleonCount",
      label: "Nucleon count",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Binding energy per nucleon in mega-electron volts.",
      id: "meVPerNucleon",
      label: "Binding energy per nucleon",
      kind: "number",
      unit: "MeV",
    },
  ],
  calculate: (input) => {
    const count = input.nucleonCount as number;
    if (count <= 0)
      simpleError(
        "nucleonCount",
        "The nucleon count must be greater than zero.",
        "invalid_nucleon_count",
      );
    return {
      meVPerNucleon: ((input.massDefectU as number) * 931.494) / count,
    };
  },
});
export const runBindingEnergyPerNucleon = bindingEnergyPerNucleonTool.execute;
export default bindingEnergyPerNucleonTool;

export type BindingEnergyPerNucleonInput = {
  readonly massDefectU: number;
  readonly nucleonCount: number;
};

export type BindingEnergyPerNucleonOutput = {
  readonly meVPerNucleon: number;
};

export const bindingEnergyPerNucleonExample = {
  input: {
    massDefectU: 1,
    nucleonCount: 1,
  },
  output: {
    meVPerNucleon: 931.494,
  },
} satisfies ToolExample<
  BindingEnergyPerNucleonInput,
  BindingEnergyPerNucleonOutput
>;
