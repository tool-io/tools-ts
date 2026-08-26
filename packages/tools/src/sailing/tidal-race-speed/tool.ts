import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TidalRaceSpeedInput = {
  readonly meanSpringRangeMeters: number;
  readonly peakStreamKt: number;
  readonly springRangeMeters: number;
};

export type TidalRaceSpeedOutput = {
  readonly raceSpeedKt: number;
};

export const tidalRaceSpeedExample = {
  input: { meanSpringRangeMeters: 5, peakStreamKt: 3, springRangeMeters: 6 },
  output: { raceSpeedKt: 3.5999999999999996 },
} satisfies ToolExample<TidalRaceSpeedInput, TidalRaceSpeedOutput>;

export const calculateTidalRaceSpeed = (
  input: TidalRaceSpeedInput,
): TidalRaceSpeedOutput => {
  if (!(input.peakStreamKt >= 0))
    simpleError(
      "peakStreamKt",
      "The reference peak stream must be non-negative.",
      "invalid_rate",
    );
  if (!(input.springRangeMeters > 0))
    simpleError(
      "springRangeMeters",
      "The local spring range must be positive.",
      "invalid_range",
    );
  if (!(input.meanSpringRangeMeters > 0))
    simpleError(
      "meanSpringRangeMeters",
      "The mean spring range must be positive.",
      "invalid_mean_range",
    );
  return {
    raceSpeedKt:
      input.peakStreamKt *
      (input.springRangeMeters / input.meanSpringRangeMeters),
  };
};

export const tidalRaceSpeedTool = createSimpleTool({
  id: "sailing/tidal-race-speed",
  title: "Tidal Race Speed Calculator",
  description:
    "Scale the published peak spring stream rate to the day's tidal range to estimate the speed of a tidal race.",
  inputs: [
    {
      description: "Peak stream rate quoted for mean springs.",
      id: "peakStreamKt",
      kind: "number",
      label: "Peak stream",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Local spring range on the day.",
      id: "springRangeMeters",
      kind: "number",
      label: "Spring range",
      unit: "m",
    },
    {
      description: "Mean spring range for the reference station.",
      id: "meanSpringRangeMeters",
      kind: "number",
      label: "Mean spring range",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Estimated speed of the tidal race.",
      format: "speed-kt",
      id: "raceSpeedKt",
      kind: "number",
      label: "Race speed",
      unit: "kt",
    },
  ],
  calculate: (input) =>
    calculateTidalRaceSpeed(input as unknown as TidalRaceSpeedInput),
});

export const runTidalRaceSpeed = tidalRaceSpeedTool.execute;
export default tidalRaceSpeedTool;
