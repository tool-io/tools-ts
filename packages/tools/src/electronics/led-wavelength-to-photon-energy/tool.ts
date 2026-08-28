import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedWavelengthToPhotonEnergyInput = {
  readonly wavelengthNm: number;
};

export type LedWavelengthToPhotonEnergyOutput = {
  readonly photonEnergyEv: number;
};

export const ledWavelengthToPhotonEnergyExample = {
  input: { wavelengthNm: 500 },
  output: { photonEnergyEv: 2.4796799999999997 },
} satisfies ToolExample<
  LedWavelengthToPhotonEnergyInput,
  LedWavelengthToPhotonEnergyOutput
>;

export const calculateLedWavelengthToPhotonEnergy = (
  input: LedWavelengthToPhotonEnergyInput,
): LedWavelengthToPhotonEnergyOutput => {
  if (!(input.wavelengthNm > 0))
    simpleError(
      "wavelengthNm",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  return { photonEnergyEv: 1239.84 / input.wavelengthNm };
};

export const ledWavelengthToPhotonEnergyTool = createSimpleTool({
  calculate: (input) =>
    calculateLedWavelengthToPhotonEnergy(
      input as unknown as LedWavelengthToPhotonEnergyInput,
    ),
  description:
    "Convert a wavelength in nanometers to photon energy in electronvolts using E = 1239.84 / lambda.",
  id: "electronics/led-wavelength-to-photon-energy",
  inputs: [
    {
      description: "Emission wavelength in nanometers.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Energy of one photon at that wavelength.",
      id: "photonEnergyEv",
      kind: "number",
      label: "Photon energy",
      unit: "eV",
    },
  ],
  title: "Photon Energy From Wavelength",
});
export const runLedWavelengthToPhotonEnergy =
  ledWavelengthToPhotonEnergyTool.execute;
export default ledWavelengthToPhotonEnergyTool;
