import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorEnergyDensityInput = {
  readonly coreVolumeCm3: number;
  readonly currentAmps: number;
  readonly lHenry: number;
};

export type InductorEnergyDensityOutput = {
  readonly energyDensityMjPerCm3: number;
};

export const inductorEnergyDensityExample = {
  input: { coreVolumeCm3: 1, currentAmps: 2, lHenry: 0.001 },
  output: { energyDensityMjPerCm3: 2 },
} satisfies ToolExample<
  InductorEnergyDensityInput,
  InductorEnergyDensityOutput
>;

export const calculateInductorEnergyDensity = (
  input: InductorEnergyDensityInput,
): InductorEnergyDensityOutput => {
  if (!(input.lHenry > 0))
    simpleError("lHenry", "Inductance must be positive.", "invalid_inductance");
  if (!(input.currentAmps > 0))
    simpleError("currentAmps", "Current must be positive.", "invalid_current");
  if (!(input.coreVolumeCm3 > 0))
    simpleError(
      "coreVolumeCm3",
      "Core volume must be positive.",
      "invalid_volume",
    );
  return {
    energyDensityMjPerCm3:
      ((0.5 * input.lHenry * input.currentAmps ** 2) / input.coreVolumeCm3) *
      1000,
  };
};

export const inductorEnergyDensityTool = createSimpleTool({
  calculate: (input) =>
    calculateInductorEnergyDensity(
      input as unknown as InductorEnergyDensityInput,
    ),
  description:
    "Compute the magnetic energy density of an inductor in millijoules per cubic centimeter from E = 0.5 * L * I^2 divided by the core volume.",
  id: "electronics/inductor-energy-density",
  inputs: [
    {
      description: "Inductance in henries.",
      id: "lHenry",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
    {
      description: "Current through the winding.",
      id: "currentAmps",
      kind: "number",
      label: "Current",
      unit: "A",
    },
    {
      description: "Core volume in cubic centimeters.",
      id: "coreVolumeCm3",
      kind: "number",
      label: "Core volume",
      unit: "cm³",
    },
  ],
  outputs: [
    {
      description: "Stored magnetic energy per unit volume.",
      id: "energyDensityMjPerCm3",
      kind: "number",
      label: "Energy density",
      unit: "mJ/cm³",
    },
  ],
  title: "Inductor Energy Density",
});
export const runInductorEnergyDensity = inductorEnergyDensityTool.execute;
export default inductorEnergyDensityTool;
