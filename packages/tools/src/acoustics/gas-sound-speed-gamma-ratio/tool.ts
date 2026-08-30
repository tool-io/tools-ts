import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasSoundSpeedGammaRatioInput = Readonly<{
  readonly heatCapacityRatio: number;
  readonly temperatureKelvin: number;
  readonly molarMassKgPerMol: number;
}>;
export type GasSoundSpeedGammaRatioOutput = Readonly<{
  readonly speedMetersPerSecond: number;
}>;

export const calculateGasSoundSpeedGammaRatio = (
  x: GasSoundSpeedGammaRatioInput,
): GasSoundSpeedGammaRatioOutput => {
  if (!Number.isFinite(x.heatCapacityRatio) || x.heatCapacityRatio <= 0)
    simpleError("heatCapacityRatio", "Provide a finite positive number.");
  if (!Number.isFinite(x.temperatureKelvin) || x.temperatureKelvin <= 0)
    simpleError("temperatureKelvin", "Provide a finite positive number.");
  if (!Number.isFinite(x.molarMassKgPerMol) || x.molarMassKgPerMol <= 0)
    simpleError("molarMassKgPerMol", "Provide a finite positive number.");
  const speedMetersPerSecond = Math.sqrt(
    (x.heatCapacityRatio * 8.31446261815324 * x.temperatureKelvin) /
      x.molarMassKgPerMol,
  );
  if (!Number.isFinite(speedMetersPerSecond))
    simpleError(
      "speedMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    speedMetersPerSecond: Object.is(speedMetersPerSecond, -0)
      ? 0
      : speedMetersPerSecond,
  };
};

export const example = {
  input: {
    heatCapacityRatio: 1.4,
    temperatureKelvin: 293.15,
    molarMassKgPerMol: 0.02897,
  },
  output: { speedMetersPerSecond: 343.2035820928282 },
} satisfies ToolExample<
  GasSoundSpeedGammaRatioInput,
  GasSoundSpeedGammaRatioOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/gas-sound-speed-gamma-ratio",
  title: "Gas Sound Speed Gamma Ratio",
  description:
    "Ideal-gas sound speed sqrt(gamma*R*T/M) from heat-capacity ratio, Kelvin temperature and molar mass.",
  inputs: [
    {
      id: "heatCapacityRatio",
      kind: "number",
      label: "Heat Capacity Ratio",
      minimum: 0,
    },
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature Kelvin",
      unit: "K",
      minimum: 0,
    },
    {
      id: "molarMassKgPerMol",
      kind: "number",
      label: "Molar Mass Kg Per Mol",
      unit: "kg/mol",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateGasSoundSpeedGammaRatio({
      heatCapacityRatio: input.heatCapacityRatio as number,
      temperatureKelvin: input.temperatureKelvin as number,
      molarMassKgPerMol: input.molarMassKgPerMol as number,
    }),
});
export const gasSoundSpeedGammaRatioTool = tool;
export const runGasSoundSpeedGammaRatio = tool.execute;
export default tool;
