import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DensityRatioInput = {
  readonly altitudeFt: number;
};

export type DensityRatioOutput = {
  readonly densityRatio: number;
};

const TROPOPAUSE_FT = 36_089.24;
const TROPOSPHERE_EXPONENT = 4.2561;
const TROPOSPHERE_LAPSE_COEFFICIENT = 6.8755856e-6;

export const densityRatioExample = {
  input: { altitudeFt: 5000 },
  output: { densityRatio: 0.861663817663 },
} satisfies ToolExample<DensityRatioInput, DensityRatioOutput>;

export const calculateDensityRatio = (
  input: DensityRatioInput,
): DensityRatioOutput => {
  const altitude = input.altitudeFt;
  if (altitude < 0)
    simpleError(
      "altitudeFt",
      "The altitude cannot be negative.",
      "invalid_altitude",
    );
  // In the troposphere sigma equals delta raised to the temperature
  // exponent; above the tropopause the density ratio continues to decay
  // with the same scale height as the pressure ratio divided by the
  // constant stratospheric temperature ratio.
  const densityRatio =
    altitude <= TROPOPAUSE_FT
      ? (1 - TROPOSPHERE_LAPSE_COEFFICIENT * altitude) ** TROPOSPHERE_EXPONENT
      : 0.297075 * Math.exp(-(altitude - TROPOPAUSE_FT) / 20_805.7);
  return { densityRatio: roundStatistic(densityRatio) };
};

export const densityRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateDensityRatio(input as unknown as DensityRatioInput),
  description:
    "Compute the ISA air density ratio against sea-level standard density.",
  id: "aviation/density-ratio",
  inputs: [
    {
      description:
        "Pressure altitude in the International Standard Atmosphere.",
      id: "altitudeFt",
      kind: "number",
      label: "Pressure altitude",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Air density divided by the sea-level standard value.",
      format: "ratio",
      id: "densityRatio",
      kind: "number",
      label: "Density ratio",
    },
  ],
  title: "Density Ratio Calculator",
});
export const runDensityRatio = densityRatioTool.execute;
export default densityRatioTool;
