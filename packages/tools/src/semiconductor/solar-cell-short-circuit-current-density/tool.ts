import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export type SolarCellShortCircuitCurrentDensityInput = {
  readonly externalQuantumEfficiencyPercent: number;
  readonly photonFluxPerCm2PerS: number;
};

export type SolarCellShortCircuitCurrentDensityOutput = {
  readonly jscMAPerCm2: number;
};

export const solarCellShortCircuitCurrentDensityExample = {
  input: {
    externalQuantumEfficiencyPercent: 100,
    photonFluxPerCm2PerS: 2.5e16,
  },
  output: { jscMAPerCm2: 4.005441585 },
} satisfies ToolExample<
  SolarCellShortCircuitCurrentDensityInput,
  SolarCellShortCircuitCurrentDensityOutput
>;

export const calculateSolarCellShortCircuitCurrentDensity = (
  input: SolarCellShortCircuitCurrentDensityInput,
): SolarCellShortCircuitCurrentDensityOutput => {
  if (input.photonFluxPerCm2PerS < 0)
    simpleError("photonFluxPerCm2PerS", "Photon flux cannot be negative.");
  const jscMAPerCm2 =
    ((input.photonFluxPerCm2PerS *
      ELEMENTARY_CHARGE_C *
      input.externalQuantumEfficiencyPercent) /
      100) *
    1000;
  if (!Number.isFinite(jscMAPerCm2))
    simpleError(
      "photonFluxPerCm2PerS",
      "Calculated current density is not finite.",
    );
  return { jscMAPerCm2 };
};

export const solarCellShortCircuitCurrentDensityTool = createSimpleTool({
  calculate: (input) =>
    calculateSolarCellShortCircuitCurrentDensity({
      externalQuantumEfficiencyPercent:
        input.externalQuantumEfficiencyPercent as number,
      photonFluxPerCm2PerS: input.photonFluxPerCm2PerS as number,
    }),
  description:
    "Compute the short-circuit current density of a solar cell from incident photon flux and external quantum efficiency.",
  id: "semiconductor/solar-cell-short-circuit-current-density",
  inputs: [
    {
      description: "External quantum efficiency.",
      id: "externalQuantumEfficiencyPercent",
      kind: "number",
      label: "External quantum efficiency",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Incident photon flux on the cell.",
      format: "flux-per-cm2-per-s",
      id: "photonFluxPerCm2PerS",
      kind: "number",
      label: "Photon flux",
      unit: "cm^-2 s^-1",
    },
  ],
  outputs: [
    {
      description: "Short-circuit current density.",
      format: "current-density-ma-per-cm2",
      id: "jscMAPerCm2",
      kind: "number",
      label: "Jsc",
      unit: "mA/cm^2",
    },
  ],
  title: "Solar Cell Jsc Calculator",
});
export const runSolarCellShortCircuitCurrentDensity =
  solarCellShortCircuitCurrentDensityTool.execute;
export default solarCellShortCircuitCurrentDensityTool;
