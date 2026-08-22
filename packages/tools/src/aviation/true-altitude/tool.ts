import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TrueAltitudeInput = {
  readonly indicatedAltitudeFt: number;
  readonly isaTemperatureC: number;
  readonly oatC: number;
};

export type TrueAltitudeOutput = {
  readonly trueAltitudeFt: number;
};

/** Correction factor: four feet per degree C of deviation per 1000 ft. */
const FT_PER_DEG_PER_THOUSAND = 4;

export const trueAltitudeExample = {
  input: { indicatedAltitudeFt: 5000, isaTemperatureC: 15, oatC: 25 },
  output: { trueAltitudeFt: 5200 },
} satisfies ToolExample<TrueAltitudeInput, TrueAltitudeOutput>;

export const calculateTrueAltitude = (
  input: TrueAltitudeInput,
): TrueAltitudeOutput => {
  const correction =
    FT_PER_DEG_PER_THOUSAND *
    (input.oatC - input.isaTemperatureC) *
    (input.indicatedAltitudeFt / 1000);
  return {
    trueAltitudeFt: roundStatistic(input.indicatedAltitudeFt + correction),
  };
};

export const trueAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateTrueAltitude(input as unknown as TrueAltitudeInput),
  description:
    "Correct an indicated altitude for the temperature deviation from ISA.",
  id: "aviation/true-altitude",
  inputs: [
    {
      description: "Indicated altitude.",
      id: "indicatedAltitudeFt",
      kind: "number",
      label: "Indicated altitude",
      unit: "ft",
    },
    {
      description: "Actual outside air temperature.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      unit: "°C",
    },
    {
      description: "ISA standard temperature at this altitude.",
      id: "isaTemperatureC",
      kind: "number",
      label: "ISA temperature",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Temperature-corrected (true) altitude.",
      format: "length-ft",
      id: "trueAltitudeFt",
      kind: "number",
      label: "True altitude",
      unit: "ft",
    },
  ],
  title: "True Altitude Calculator",
});
export const runTrueAltitude = trueAltitudeTool.execute;
export default trueAltitudeTool;
