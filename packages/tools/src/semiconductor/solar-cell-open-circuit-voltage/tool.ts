import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export type SolarCellOpenCircuitVoltageInput = {
  readonly j0MAPerCm2: number;
  readonly jscMAPerCm2: number;
  readonly idealityFactor?: number;
  readonly temperatureKelvin?: number;
};

export type SolarCellOpenCircuitVoltageOutput = {
  readonly openCircuitVoltage: number;
};

export const solarCellOpenCircuitVoltageExample = {
  input: { j0MAPerCm2: 1e-12, jscMAPerCm2: 30 },
  output: { openCircuitVoltage: 0.802244905958821 },
} satisfies ToolExample<
  SolarCellOpenCircuitVoltageInput,
  SolarCellOpenCircuitVoltageOutput
>;

export const calculateSolarCellOpenCircuitVoltage = (
  input: SolarCellOpenCircuitVoltageInput,
): SolarCellOpenCircuitVoltageOutput => {
  if (input.jscMAPerCm2 <= 0)
    simpleError(
      "jscMAPerCm2",
      "Short-circuit current density must be positive.",
    );
  if (input.j0MAPerCm2 <= 0)
    simpleError("j0MAPerCm2", "Saturation current density must be positive.");
  const temperatureKelvin = input.temperatureKelvin ?? 300;
  const idealityFactor = input.idealityFactor ?? 1;
  if (!(temperatureKelvin > 0))
    simpleError("temperatureKelvin", "Temperature must be positive.");
  if (!(idealityFactor > 0))
    simpleError("idealityFactor", "Ideality factor must be positive.");
  const ratio = input.jscMAPerCm2 / input.j0MAPerCm2;
  const logarithm = Number.isFinite(ratio)
    ? Math.log1p(ratio)
    : Math.log(input.jscMAPerCm2) - Math.log(input.j0MAPerCm2);
  return {
    openCircuitVoltage:
      idealityFactor * BOLTZMANN_EV_PER_K * temperatureKelvin * logarithm,
  };
};

export const solarCellOpenCircuitVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateSolarCellOpenCircuitVoltage({
      idealityFactor: input.idealityFactor as number,
      j0MAPerCm2: input.j0MAPerCm2 as number,
      jscMAPerCm2: input.jscMAPerCm2 as number,
      temperatureKelvin: input.temperatureKelvin as number,
    }),
  description:
    "Compute the open-circuit voltage of a solar cell from its short-circuit and dark saturation current densities.",
  id: "semiconductor/solar-cell-open-circuit-voltage",
  inputs: [
    {
      description: "Dark saturation current density.",
      format: "current-density-ma-per-cm2",
      id: "j0MAPerCm2",
      kind: "number",
      label: "Saturation current density",
      unit: "mA/cm^2",
    },
    {
      default: 300,
      description: "Cell temperature.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      unit: "K",
    },
    {
      default: 1,
      description: "Ideality factor of the illuminated diode.",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
    },
    {
      description: "Short-circuit current density.",
      format: "current-density-ma-per-cm2",
      id: "jscMAPerCm2",
      kind: "number",
      label: "Jsc",
      unit: "mA/cm^2",
    },
  ],
  outputs: [
    {
      description: "Open-circuit voltage.",
      format: "voltage-v",
      id: "openCircuitVoltage",
      kind: "number",
      label: "Voc",
      unit: "V",
    },
  ],
  title: "Solar Cell Voc Calculator",
});
export const runSolarCellOpenCircuitVoltage =
  solarCellOpenCircuitVoltageTool.execute;
export default solarCellOpenCircuitVoltageTool;
