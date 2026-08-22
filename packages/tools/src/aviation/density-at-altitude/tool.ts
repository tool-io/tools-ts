import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DensityAtAltitudeInput = {
  readonly altitudeFt: number;
};

export type DensityAtAltitudeOutput = {
  readonly densityRatio: number;
};

const TROPOPAUSE_FT = 36_089.24;
const TROPOSPHERE_EXPONENT = 4.2561;
const LAPSE_COEFFICIENT = 6.8755856e-6;

export const densityAtAltitudeExample = {
  input: { altitudeFt: 5000 },
  output: { densityRatio: 0.8616638176634814 },
} satisfies ToolExample<DensityAtAltitudeInput, DensityAtAltitudeOutput>;

export const calculateDensityAtAltitude = (
  input: DensityAtAltitudeInput,
): DensityAtAltitudeOutput => {
  if (input.altitudeFt < 0)
    simpleError(
      "altitudeFt",
      "The altitude cannot be negative.",
      "invalid_altitude",
    );
  if (input.altitudeFt > TROPOPAUSE_FT)
    simpleError(
      "altitudeFt",
      "The altitude cannot be above the tropopause.",
      "above_tropopause",
    );
  return {
    densityRatio:
      (1 - LAPSE_COEFFICIENT * input.altitudeFt) ** TROPOSPHERE_EXPONENT,
  };
};

export const densityAtAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateDensityAtAltitude(input as unknown as DensityAtAltitudeInput),
  description:
    "Compute the ISA air density ratio against sea-level standard density in the troposphere.",
  id: "aviation/density-at-altitude",
  inputs: [
    {
      description:
        "Pressure altitude within the troposphere (up to about 36,089 ft).",
      id: "altitudeFt",
      kind: "number",
      label: "Pressure altitude",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Density divided by the sea-level standard value.",
      format: "ratio",
      id: "densityRatio",
      kind: "number",
      label: "Density ratio",
    },
  ],
  title: "Density at Altitude Calculator",
});
export const runDensityAtAltitude = densityAtAltitudeTool.execute;
export default densityAtAltitudeTool;
