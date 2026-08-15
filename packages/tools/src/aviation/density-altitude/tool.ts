import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
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

export const calculateDensityAltitude = (
  input: DensityAltitudeInput,
): DensityAltitudeOutput => {
  const isaTemperatureC = 15 - ISA_LAPSE_PER_FT * input.pressureAltitudeFt;
  const densityAltitudeFt =
    input.pressureAltitudeFt + 118.8 * (input.oatC - isaTemperatureC);
  return { densityAltitudeFt: roundStatistic(densityAltitudeFt) };
};

export const densityAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateDensityAltitude(input as unknown as DensityAltitudeInput),
  description:
    "Compute density altitude from pressure altitude and outside air temperature.",
  id: "aviation/density-altitude",
  inputs: [
    {
      description: "Pressure altitude of the observation.",
      id: "pressureAltitudeFt",
      kind: "number",
      label: "Pressure altitude",
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
