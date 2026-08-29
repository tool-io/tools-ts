import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const vanDerWaalsVolumeCorrectionTool = createSimpleTool({
  id: "chemistry/van-der-waals-volume-correction",
  title: "Van der Waals Volume Correction Calculator",
  description:
    "Compute the excluded volume n·b subtracted from container size in the van der Waals equation.",
  inputs: [
    {
      description: "Moles of gas.",
      id: "moles",
      label: "Moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Excluded-volume constant b per mole.",
      id: "bLPerMol",
      label: "Constant b",
      kind: "number",
      minimum: 0,
      unit: "L/mol",
    },
  ],
  outputs: [
    {
      description: "Excluded volume n·b in liters.",
      id: "excludedVolumeL",
      label: "Excluded volume",
      kind: "number",
      unit: "L",
    },
  ],
  calculate: (input) => {
    return {
      excludedVolumeL: (input.moles as number) * (input.bLPerMol as number),
    };
  },
});
export const runVanDerWaalsVolumeCorrection =
  vanDerWaalsVolumeCorrectionTool.execute;
export default vanDerWaalsVolumeCorrectionTool;

export type VanDerWaalsVolumeCorrectionInput = {
  readonly moles: number;
  readonly bLPerMol: number;
};

export type VanDerWaalsVolumeCorrectionOutput = {
  readonly excludedVolumeL: number;
};

export const vanDerWaalsVolumeCorrectionExample = {
  input: {
    moles: 1,
    bLPerMol: 1,
  },
  output: {
    excludedVolumeL: 1,
  },
} satisfies ToolExample<
  VanDerWaalsVolumeCorrectionInput,
  VanDerWaalsVolumeCorrectionOutput
>;
