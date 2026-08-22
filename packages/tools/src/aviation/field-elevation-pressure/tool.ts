import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FieldElevationPressureInput = {
  readonly elevationFt: number;
};

export type FieldElevationPressureOutput = {
  readonly pressureHpa: number;
};

const SEA_LEVEL_HPA = 1013.25;
const TROPOPAUSE_FT = 36_089.24;
const LAPSE_COEFFICIENT = 6.8755856e-6;
const TROPOSPHERE_EXPONENT = 5.25588;
const STRATOSPHERE_HPA = 226.32;
const STRATOSPHERE_SCALE_FT = 20_805.7;

export const fieldElevationPressureExample = {
  input: { elevationFt: 2500 },
  output: { pressureHpa: 924.996234842 },
} satisfies ToolExample<
  FieldElevationPressureInput,
  FieldElevationPressureOutput
>;

export const calculateFieldElevationPressure = (
  input: FieldElevationPressureInput,
): FieldElevationPressureOutput => {
  if (input.elevationFt < 0)
    simpleError(
      "elevationFt",
      "The elevation cannot be negative.",
      "invalid_altitude",
    );
  const hpa =
    input.elevationFt <= TROPOPAUSE_FT
      ? SEA_LEVEL_HPA *
        (1 - LAPSE_COEFFICIENT * input.elevationFt) ** TROPOSPHERE_EXPONENT
      : STRATOSPHERE_HPA *
        Math.exp(-(input.elevationFt - TROPOPAUSE_FT) / STRATOSPHERE_SCALE_FT);
  return { pressureHpa: roundStatistic(hpa) };
};

export const fieldElevationPressureTool = createSimpleTool({
  calculate: (input) =>
    calculateFieldElevationPressure(
      input as unknown as FieldElevationPressureInput,
    ),
  description:
    "Compute the ISA static pressure in hectopascals at a given field elevation.",
  id: "aviation/field-elevation-pressure",
  inputs: [
    {
      description: "Field elevation above sea level.",
      id: "elevationFt",
      kind: "number",
      label: "Elevation",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "ISA static pressure.",
      format: "pressure-hpa",
      id: "pressureHpa",
      kind: "number",
      label: "Pressure",
      unit: "hPa",
    },
  ],
  title: "Field Elevation Pressure Calculator",
});
export const runFieldElevationPressure = fieldElevationPressureTool.execute;
export default fieldElevationPressureTool;
