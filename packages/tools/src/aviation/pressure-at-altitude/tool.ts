import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PressureAtAltitudeInput = {
  readonly altitudeFt: number;
};

export type PressureAtAltitudeOutput = {
  readonly pressureHpa: number;
};

const SEA_LEVEL_HPA = 1013.25;
const TROPOPAUSE_FT = 36_089.24;
const LAPSE_COEFFICIENT = 6.8755856e-6;
const TROPOSPHERE_EXPONENT = 5.25588;

export const pressureAtAltitudeExample = {
  input: { altitudeFt: 5000 },
  output: { pressureHpa: 843.0726406277355 },
} satisfies ToolExample<PressureAtAltitudeInput, PressureAtAltitudeOutput>;

export const calculatePressureAtAltitude = (
  input: PressureAtAltitudeInput,
): PressureAtAltitudeOutput => {
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
    pressureHpa:
      SEA_LEVEL_HPA *
      (1 - LAPSE_COEFFICIENT * input.altitudeFt) ** TROPOSPHERE_EXPONENT,
  };
};

export const pressureAtAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculatePressureAtAltitude(input as unknown as PressureAtAltitudeInput),
  description:
    "Compute the ISA static pressure at a given pressure altitude in the troposphere.",
  id: "aviation/pressure-at-altitude",
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
      description: "ISA static pressure.",
      format: "pressure-hpa",
      id: "pressureHpa",
      kind: "number",
      label: "Pressure",
      unit: "hPa",
    },
  ],
  title: "Pressure at Altitude Calculator",
});
export const runPressureAtAltitude = pressureAtAltitudeTool.execute;
export default pressureAtAltitudeTool;
