import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RadarMaxRangeInput = {
  readonly antennaGainLinear: number;
  readonly minimumDetectablePowerWatts: number;
  readonly ptxWatts: number;
  readonly radarCrossSectionM2: number;
  readonly wavelengthMeters: number;
};

export type RadarMaxRangeOutput = {
  readonly maximumRangeMeters: number;
};

export const radarMaxRangeExample = {
  input: {
    antennaGainLinear: 10,
    minimumDetectablePowerWatts: 1e-12,
    ptxWatts: 100,
    radarCrossSectionM2: 1,
    wavelengthMeters: 0.03,
  },
  output: { maximumRangeMeters: 259.5094813775928 },
} satisfies ToolExample<RadarMaxRangeInput, RadarMaxRangeOutput>;

export const calculateRadarMaxRange = (
  input: RadarMaxRangeInput,
): RadarMaxRangeOutput => {
  if (!(input.ptxWatts > 0))
    simpleError(
      "ptxWatts",
      "Transmit power must be positive.",
      "invalid_power",
    );
  if (!(input.antennaGainLinear > 0))
    simpleError(
      "antennaGainLinear",
      "Antenna gain must be positive.",
      "invalid_gain",
    );
  if (!(input.wavelengthMeters > 0))
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  if (!(input.radarCrossSectionM2 > 0))
    simpleError(
      "radarCrossSectionM2",
      "Radar cross section must be positive.",
      "invalid_rcs",
    );
  if (!(input.minimumDetectablePowerWatts > 0))
    simpleError(
      "minimumDetectablePowerWatts",
      "Minimum detectable power must be positive.",
      "invalid_sensitivity",
    );
  return {
    maximumRangeMeters: Math.pow(
      (input.ptxWatts *
        input.antennaGainLinear ** 2 *
        input.wavelengthMeters ** 2 *
        input.radarCrossSectionM2) /
        (1984.4017 * input.minimumDetectablePowerWatts),
      0.25,
    ),
  };
};

export const radarMaxRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateRadarMaxRange(input as unknown as RadarMaxRangeInput),
  description:
    "Compute monostatic radar maximum detection range as the fourth root of the radar range equation numerator over (4 x pi)^3 x Pmin, with (4 x pi)^3 approximated by 1984.4017.",
  id: "electronics/radar-max-range",
  inputs: [
    {
      id: "antennaGainLinear",
      kind: "number",
      label: "Antenna gain (linear)",
    },
    {
      id: "minimumDetectablePowerWatts",
      kind: "number",
      label: "Minimum detectable power",
      unit: "W",
    },
    { id: "ptxWatts", kind: "number", label: "Transmit power", unit: "W" },
    {
      id: "radarCrossSectionM2",
      kind: "number",
      label: "Radar cross section",
      unit: "m²",
    },
    { id: "wavelengthMeters", kind: "number", label: "Wavelength", unit: "m" },
  ],
  outputs: [
    {
      id: "maximumRangeMeters",
      kind: "number",
      label: "Maximum range",
      unit: "m",
    },
  ],
  title: "Radar Max Range",
});
export const runRadarMaxRange = radarMaxRangeTool.execute;
export default radarMaxRangeTool;
