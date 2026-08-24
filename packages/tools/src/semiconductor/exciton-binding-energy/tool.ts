import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const RYDBERG_EV = 13.605693122994;

export type ExcitonBindingEnergyInput = {
  readonly reducedMassOverM0: number;
  readonly relativePermittivity: number;
};

export type ExcitonBindingEnergyOutput = {
  readonly bindingEnergyEv: number;
};

export const excitonBindingEnergyExample = {
  input: { reducedMassOverM0: 0.2, relativePermittivity: 11.7 },
  output: { bindingEnergyEv: 0.019878286394906863 },
} satisfies ToolExample<ExcitonBindingEnergyInput, ExcitonBindingEnergyOutput>;

export const calculateExcitonBindingEnergy = (
  input: ExcitonBindingEnergyInput,
): ExcitonBindingEnergyOutput => {
  if (!Number.isFinite(input.reducedMassOverM0) || input.reducedMassOverM0 <= 0)
    simpleError(
      "reducedMassOverM0",
      "Reduced mass ratio must be a finite number greater than zero.",
      "invalid_reduced_mass",
    );
  if (
    !Number.isFinite(input.relativePermittivity) ||
    input.relativePermittivity <= 0
  )
    simpleError(
      "relativePermittivity",
      "Relative permittivity must be a finite number greater than zero.",
      "invalid_permittivity",
    );

  const directResult =
    (RYDBERG_EV * input.reducedMassOverM0) / input.relativePermittivity ** 2;
  if (Number.isFinite(directResult) && directResult > 0)
    return { bindingEnergyEv: directResult };

  const bindingEnergyEv = Math.exp(
    Math.log(RYDBERG_EV) +
      Math.log(input.reducedMassOverM0) -
      2 * Math.log(input.relativePermittivity),
  );
  if (!Number.isFinite(bindingEnergyEv))
    simpleError(
      "reducedMassOverM0",
      "The binding energy is too large to represent.",
      "numeric_overflow",
    );
  if (bindingEnergyEv === 0)
    simpleError(
      "relativePermittivity",
      "The binding energy is too small to represent.",
      "numeric_underflow",
    );
  return { bindingEnergyEv };
};

export const excitonBindingEnergyTool = createSimpleTool({
  calculate: (input) =>
    calculateExcitonBindingEnergy({
      reducedMassOverM0: input.reducedMassOverM0 as number,
      relativePermittivity: input.relativePermittivity as number,
    }),
  description:
    "Compute the 3D hydrogenic Wannier-Mott exciton ground-state binding energy from reduced electron-hole mass and relative permittivity.",
  id: "semiconductor/exciton-binding-energy",
  inputs: [
    {
      description:
        "Reduced electron-hole mass µ divided by the free-electron mass m0.",
      id: "reducedMassOverM0",
      kind: "number",
      label: "Reduced mass ratio",
      minimum: Number.MIN_VALUE,
    },
    {
      description:
        "Relative permittivity used to screen the electron-hole interaction; choose the dielectric response appropriate to the material and model.",
      id: "relativePermittivity",
      kind: "number",
      label: "Relative permittivity",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Hydrogenic ground-state binding energy Ry × (µ/m0) / εr².",
      format: "energy-ev",
      id: "bindingEnergyEv",
      kind: "number",
      label: "Binding energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
  ],
  title: "Exciton Binding Energy Calculator",
});
export const runExcitonBindingEnergy = excitonBindingEnergyTool.execute;
export default excitonBindingEnergyTool;
