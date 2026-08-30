import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuantumCascadeLaserWavelengthInput = Readonly<{
  readonly transitionElectronVolts: number;
}>;
export type QuantumCascadeLaserWavelengthOutput = Readonly<{
  readonly wavelengthMicrometers: number;
}>;

export const calculateQuantumCascadeLaserWavelength = (
  x: QuantumCascadeLaserWavelengthInput,
): QuantumCascadeLaserWavelengthOutput => {
  if (
    !Number.isFinite(x.transitionElectronVolts) ||
    x.transitionElectronVolts < 0
  )
    simpleError(
      "transitionElectronVolts",
      "Provide a finite number at least 0.",
    );
  const wavelengthMicrometers = 1.2398419843320026 / x.transitionElectronVolts;
  if (!Number.isFinite(wavelengthMicrometers))
    simpleError(
      "wavelengthMicrometers",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wavelengthMicrometers: Object.is(wavelengthMicrometers, -0)
      ? 0
      : wavelengthMicrometers,
  };
};

export const example = {
  input: { transitionElectronVolts: 0.124 },
  output: { wavelengthMicrometers: 9.998725680096795 },
} satisfies ToolExample<
  QuantumCascadeLaserWavelengthInput,
  QuantumCascadeLaserWavelengthOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/quantum-cascade-laser-wavelength",
  title: "Quantum Cascade Laser Wavelength",
  description:
    "Photon wavelength of a quantum-cascade laser from intersubband transition energy in electronvolts.",
  inputs: [
    {
      id: "transitionElectronVolts",
      kind: "number",
      label: "Transition Electron Volts",
      unit: "eV",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wavelengthMicrometers",
      kind: "number",
      label: "Wavelength Micrometers",
      unit: "µm",
    },
  ],
  calculate: (input) =>
    calculateQuantumCascadeLaserWavelength({
      transitionElectronVolts: input.transitionElectronVolts as number,
    }),
});
export const quantumCascadeLaserWavelengthTool = tool;
export const runQuantumCascadeLaserWavelength = tool.execute;
export default tool;
