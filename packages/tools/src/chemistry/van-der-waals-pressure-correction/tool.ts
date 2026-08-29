import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const vanDerWaalsPressureCorrectionTool = createSimpleTool({
  id: "chemistry/van-der-waals-pressure-correction",
  title: "Van der Waals Pressure Correction Calculator",
  description:
    "Compute the corrected pressure from the van der Waals equation P = nRT/(V−nb) − a(n/V)².",
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
      description: "Container volume; must exceed n·b.",
      id: "volumeL",
      label: "Volume",
      kind: "number",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Absolute temperature.",
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      description: "Attractive-interaction constant.",
      id: "aAtmL2PerMol2",
      label: "Constant a",
      kind: "number",
      unit: "atm·L²/mol²",
    },
    {
      description: "Excluded-volume constant.",
      id: "bLPerMol",
      label: "Constant b",
      kind: "number",
      unit: "L/mol",
    },
  ],
  outputs: [
    {
      description: "Corrected pressure.",
      id: "pressureAtm",
      label: "Pressure",
      kind: "number",
      unit: "atm",
    },
  ],
  calculate: (input) => {
    const R = 0.08206;
    const moles = input.moles as number;
    const volume = input.volumeL as number;
    const b = input.bLPerMol as number;
    const availableVolume = volume - moles * b;
    if (availableVolume <= 0)
      simpleError(
        "volumeL",
        "The volume must be greater than the excluded volume n·b.",
        "invalid_volume",
      );
    return {
      pressureAtm:
        (moles * R * (input.temperatureK as number)) / availableVolume -
        ((input.aAtmL2PerMol2 as number) * moles ** 2) / volume ** 2,
    };
  },
});
export const runVanDerWaalsPressureCorrection =
  vanDerWaalsPressureCorrectionTool.execute;
export default vanDerWaalsPressureCorrectionTool;

export type VanDerWaalsPressureCorrectionInput = {
  readonly moles: number;
  readonly volumeL: number;
  readonly temperatureK: number;
  readonly aAtmL2PerMol2: number;
  readonly bLPerMol: number;
};

export type VanDerWaalsPressureCorrectionOutput = {
  readonly pressureAtm: number;
};

export const vanDerWaalsPressureCorrectionExample = {
  input: {
    moles: 1,
    volumeL: 2,
    temperatureK: 1,
    aAtmL2PerMol2: 1,
    bLPerMol: 1,
  },
  output: {
    pressureAtm: -0.16794,
  },
} satisfies ToolExample<
  VanDerWaalsPressureCorrectionInput,
  VanDerWaalsPressureCorrectionOutput
>;
