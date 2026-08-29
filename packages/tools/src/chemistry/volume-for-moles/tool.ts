import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VolumeForMolesInput = {
  readonly moles: number;
  readonly molarity: number;
};

export type VolumeForMolesOutput = {
  readonly volumeLiters: number;
};

export const volumeForMolesExample = {
  input: { moles: 0.25, molarity: 0.5 },
  output: { volumeLiters: 0.5 },
} satisfies ToolExample<VolumeForMolesInput, VolumeForMolesOutput>;

export const volumeForMolesTool = createSimpleTool({
  id: "chemistry/volume-for-moles",
  title: "Volume For Moles Calculator",
  description:
    "Compute the solution volume that contains a given amount of solute at a given molarity.",
  inputs: [
    {
      description: "Amount of solute.",
      id: "moles",
      kind: "number",
      label: "Moles",
      unit: "mol",
    },
    {
      description: "Molar concentration of the solution.",
      id: "molarity",
      kind: "number",
      label: "Molarity",
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description: "Solution volume.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      unit: "L",
    },
  ],
  calculate: (input) => {
    const moles = input.moles as number;
    if (moles < 0) simpleError("moles", "The amount cannot be negative.");
    const molarity = input.molarity as number;
    if (!(molarity > 0))
      simpleError("molarity", "The molarity must be greater than zero.");
    return { volumeLiters: moles / molarity };
  },
});
export const runVolumeForMoles = volumeForMolesTool.execute;
export default volumeForMolesTool;
