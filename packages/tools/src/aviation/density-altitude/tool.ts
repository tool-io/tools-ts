import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DensityAltitudeInput = {
  readonly oatC: number;
  readonly pressureAltitudeFt: number;
};

export type DensityAltitudeOutput = {
  readonly densityAltitudeFt: number;
};

export const densityAltitudeExample = {
  input: { oatC: 15, pressureAltitudeFt: 0 },
  output: { densityAltitudeFt: 0 },
} satisfies ToolExample<DensityAltitudeInput, DensityAltitudeOutput>;

/** ISA temperature lapse rate, about 1.98 °C per 1000 ft. */
const ISA_LAPSE_PER_FT = 0.0019812;
const TROPOPAUSE_FT = 36_089.24;
const LOWER_STRATOSPHERE_TOP_FT = 65_616.8;
const STRATOSPHERE_C = -56.5;

export const calculateDensityAltitude = (
  input: DensityAltitudeInput,
): DensityAltitudeOutput => {
  if (!Number.isFinite(input.pressureAltitudeFt))
    simpleError(
      "pressureAltitudeFt",
      "Pressure altitude must be finite.",
      "invalid_pressure_altitude",
    );
  if (input.pressureAltitudeFt > LOWER_STRATOSPHERE_TOP_FT)
    simpleError(
      "pressureAltitudeFt",
      "This approximation supports pressure altitudes through 65,616.8 feet.",
      "unsupported_pressure_altitude",
    );
  if (!Number.isFinite(input.oatC))
    simpleError(
      "oatC",
      "Outside air temperature must be finite.",
      "invalid_oat",
    );
  const isaTemperatureC =
    input.pressureAltitudeFt > TROPOPAUSE_FT
      ? STRATOSPHERE_C
      : 15 - ISA_LAPSE_PER_FT * input.pressureAltitudeFt;
  const densityAltitudeFt =
    input.pressureAltitudeFt + 118.8 * (input.oatC - isaTemperatureC);
  if (!Number.isFinite(densityAltitudeFt))
    simpleError(
      "oatC",
      "The density-altitude estimate exceeds the numeric range.",
      "numeric_range",
    );
  return { densityAltitudeFt: roundStatistic(densityAltitudeFt) };
};

export const densityAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateDensityAltitude({
      oatC: input.oatC as number,
      pressureAltitudeFt: input.pressureAltitudeFt as number,
    }),
  description:
    "Compute density altitude from pressure altitude and outside air temperature.",
  id: "aviation/density-altitude",
  inputs: [
    {
      description: "Pressure altitude of the observation.",
      id: "pressureAltitudeFt",
      kind: "number",
      label: "Pressure altitude",
      maximum: LOWER_STRATOSPHERE_TOP_FT,
      unit: "ft",
    },
    {
      description: "Outside air temperature.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Density altitude for the given conditions.",
      id: "densityAltitudeFt",
      kind: "number",
      label: "Density altitude",
      unit: "ft",
    },
  ],
  title: "Density Altitude Calculator",
});
export const runDensityAltitude = densityAltitudeTool.execute;
export default densityAltitudeTool;
