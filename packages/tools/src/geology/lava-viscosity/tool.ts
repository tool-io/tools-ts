import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_J_PER_MOL_K = 8.314462618;

export type LavaViscosityInput = {
  readonly activationEnergyJPerMol: number;
  readonly preExponentialPaSecond: number;
  readonly temperatureKelvin: number;
};

export type LavaViscosityOutput = {
  readonly viscosityPascalSeconds: number;
};

export const calculateLavaViscosity = (
  input: LavaViscosityInput,
): LavaViscosityOutput => {
  if (!(input.activationEnergyJPerMol > 0))
    simpleError(
      "activationEnergyJPerMol",
      "Activation energy must be greater than zero.",
      "invalid_energy",
    );
  if (!(input.preExponentialPaSecond > 0))
    simpleError(
      "preExponentialPaSecond",
      "Pre-exponential factor must be greater than zero.",
      "invalid_viscosity",
    );
  if (!(input.temperatureKelvin > 0))
    simpleError(
      "temperatureKelvin",
      "Temperature must be greater than zero kelvin.",
      "invalid_temperature",
    );
  return {
    viscosityPascalSeconds:
      input.preExponentialPaSecond *
      Math.exp(
        input.activationEnergyJPerMol /
          (R_J_PER_MOL_K * input.temperatureKelvin),
      ),
  };
};

export const lavaViscosityExample = {
  input: {
    activationEnergyJPerMol: 50000,
    preExponentialPaSecond: 10,
    temperatureKelvin: 1000,
  },
  output: { viscosityPascalSeconds: 4089.6016378770355 },
} satisfies ToolExample<LavaViscosityInput, LavaViscosityOutput>;

export const lavaViscosityTool = createSimpleTool({
  id: "geology/lava-viscosity",
  title: "Lava Viscosity Calculator",
  description:
    "Arrhenius melt viscosity eta = eta0 * exp(Ea / (R T)) with Ea in J/mol, eta0 in pascal seconds and T in kelvin.",
  inputs: [
    {
      description: "Activation energy for viscous flow in J/mol.",
      id: "activationEnergyJPerMol",
      kind: "number",
      label: "Activation energy",
      minimum: 0,
    },
    {
      description: "Pre-exponential viscosity factor eta0 in pascal seconds.",
      id: "preExponentialPaSecond",
      kind: "number",
      label: "eta0",
      minimum: 0,
    },
    {
      description: "Absolute temperature in kelvin.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dynamic viscosity in pascal seconds.",
      id: "viscosityPascalSeconds",
      kind: "number",
      label: "Viscosity",
    },
  ],
  calculate: (input) =>
    calculateLavaViscosity(input as unknown as LavaViscosityInput),
});

export const runLavaViscosity = lavaViscosityTool.execute;
export default lavaViscosityTool;
