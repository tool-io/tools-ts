import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type IsaPressureAtTropopauseInput = {
  readonly altitudeMeters: number;
};

export type IsaPressureAtTropopauseOutput = {
  readonly pressureHpa: number;
};

const SEA_LEVEL_PRESSURE_HPA = 1013.25;
const TROPOPAUSE_METERS = 11000;
const TROPOPAUSE_PRESSURE_HPA = 226.321;
const TROPOSPHERE_COEFFICIENT_PER_METER = 2.25577e-5;
const TROPOSPHERE_EXPONENT = 5.25588;
const STRATOSPHERE_SCALE_HEIGHT_METERS = 6341.62;

export const isaPressureAtTropopauseExample = {
  input: { altitudeMeters: 0 },
  output: { pressureHpa: 1013.25 },
} satisfies ToolExample<
  IsaPressureAtTropopauseInput,
  IsaPressureAtTropopauseOutput
>;

export const calculateIsaPressureAtTropopause = (
  input: IsaPressureAtTropopauseInput,
): IsaPressureAtTropopauseOutput => ({
  pressureHpa:
    input.altitudeMeters <= TROPOPAUSE_METERS
      ? SEA_LEVEL_PRESSURE_HPA *
        Math.pow(
          1 - TROPOSPHERE_COEFFICIENT_PER_METER * input.altitudeMeters,
          TROPOSPHERE_EXPONENT,
        )
      : TROPOPAUSE_PRESSURE_HPA *
        Math.exp(
          -(input.altitudeMeters - TROPOPAUSE_METERS) /
            STRATOSPHERE_SCALE_HEIGHT_METERS,
        ),
});

export const isaPressureAtTropopauseTool = createSimpleTool({
  calculate: (input) =>
    calculateIsaPressureAtTropopause(
      input as unknown as IsaPressureAtTropopauseInput,
    ),
  description:
    "Compute ISA standard pressure for a geopotential altitude through the troposphere and lower stratosphere.",
  id: "aviation/isa-pressure-at-tropopause",
  inputs: [
    {
      description: "Geopotential altitude above sea level.",
      id: "altitudeMeters",
      kind: "number",
      label: "Altitude",
      maximum: 20000,
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "ISA standard pressure at the altitude, piecewise across the tropopause.",
      format: "pressure-hpa",
      id: "pressureHpa",
      kind: "number",
      label: "ISA pressure",
      unit: "hPa",
    },
  ],
  title: "ISA Pressure at Altitude Calculator",
});
export const runIsaPressureAtTropopause = isaPressureAtTropopauseTool.execute;
export default isaPressureAtTropopauseTool;
