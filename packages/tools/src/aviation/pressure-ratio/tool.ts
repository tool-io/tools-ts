import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PressureRatioInput = {
  readonly altitudeFt: number;
};

export type PressureRatioOutput = {
  readonly pressureRatio: number;
};

/** Tropopause height and constants of the ISA model. */
const TROPOPAUSE_FT = 36_089.24;
const TROPOPAUSE_PRESSURE_RATIO = 0.223361;
const TROPOSPHERE_EXPONENT = 5.25588;
const TROPOSPHERE_LAPSE_COEFFICIENT = 6.8755856e-6;
const STRATOSPHERE_SCALE_FT = 20_805.7;

export const pressureRatioExample = {
  input: { altitudeFt: 5000 },
  output: { pressureRatio: 0.832048004567 },
} satisfies ToolExample<PressureRatioInput, PressureRatioOutput>;

export const calculatePressureRatio = (
  input: PressureRatioInput,
): PressureRatioOutput => {
  const altitude = input.altitudeFt;
  if (altitude < 0)
    simpleError(
      "altitudeFt",
      "The altitude cannot be negative.",
      "invalid_altitude",
    );
  const pressureRatio =
    altitude <= TROPOPAUSE_FT
      ? (1 - TROPOSPHERE_LAPSE_COEFFICIENT * altitude) ** TROPOSPHERE_EXPONENT
      : TROPOPAUSE_PRESSURE_RATIO *
        Math.exp(-(altitude - TROPOPAUSE_FT) / STRATOSPHERE_SCALE_FT);
  return { pressureRatio: roundStatistic(pressureRatio) };
};

/** Inverts the ISA model: altitude for a given static pressure ratio. */
export const altitudeFromRatio = (pressureRatio: number): number => {
  if (pressureRatio <= 0 || pressureRatio > 1)
    simpleError(
      "pressureRatio",
      "The pressure ratio must be between zero and one.",
      "invalid_ratio",
    );
  if (pressureRatio <= TROPOPAUSE_PRESSURE_RATIO)
    return (
      TROPOPAUSE_FT -
      STRATOSPHERE_SCALE_FT *
        Math.log(pressureRatio / TROPOPAUSE_PRESSURE_RATIO)
    );
  return (
    (1 - pressureRatio ** (1 / TROPOSPHERE_EXPONENT)) /
    TROPOSPHERE_LAPSE_COEFFICIENT
  );
};

export const pressureRatioTool = createSimpleTool({
  calculate: (input) =>
    calculatePressureRatio(input as unknown as PressureRatioInput),
  description:
    "Compute the ISA static pressure ratio against sea-level standard pressure.",
  id: "aviation/pressure-ratio",
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
      description: "Static pressure divided by the sea-level standard value.",
      format: "ratio",
      id: "pressureRatio",
      kind: "number",
      label: "Pressure ratio",
    },
  ],
  title: "Pressure Ratio Calculator",
});
export const runPressureRatio = pressureRatioTool.execute;
export default pressureRatioTool;
