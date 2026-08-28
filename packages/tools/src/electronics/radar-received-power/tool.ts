import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RadarReceivedPowerInput = {
  readonly antennaGainLinear: number;
  readonly ptxWatts: number;
  readonly radarCrossSectionM2: number;
  readonly rangeMeters: number;
  readonly wavelengthMeters: number;
};

export type RadarReceivedPowerOutput = {
  readonly receivedPowerWatts: number;
};

export const radarReceivedPowerExample = {
  input: {
    antennaGainLinear: 10,
    ptxWatts: 100,
    radarCrossSectionM2: 1,
    rangeMeters: 1000,
    wavelengthMeters: 0.03,
  },
  output: { receivedPowerWatts: 4.535372046899577e-15 },
} satisfies ToolExample<RadarReceivedPowerInput, RadarReceivedPowerOutput>;

export const calculateRadarReceivedPower = (
  input: RadarReceivedPowerInput,
): RadarReceivedPowerOutput => {
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
  if (!(input.rangeMeters > 0))
    simpleError("rangeMeters", "Range must be positive.", "invalid_range");
  if (!(input.radarCrossSectionM2 >= 0))
    simpleError(
      "radarCrossSectionM2",
      "Radar cross section cannot be negative.",
      "invalid_rcs",
    );
  return {
    receivedPowerWatts:
      (input.ptxWatts *
        input.antennaGainLinear ** 2 *
        input.wavelengthMeters ** 2 *
        input.radarCrossSectionM2) /
      (1984.4017 * input.rangeMeters ** 4),
  };
};

export const radarReceivedPowerTool = createSimpleTool({
  calculate: (input) =>
    calculateRadarReceivedPower(input as unknown as RadarReceivedPowerInput),
  description:
    "Compute monostatic radar received power via the radar range equation with (4 x pi)^3 approximated by 1984.4017.",
  id: "electronics/radar-received-power",
  inputs: [
    {
      id: "antennaGainLinear",
      kind: "number",
      label: "Antenna gain (linear)",
    },
    { id: "ptxWatts", kind: "number", label: "Transmit power", unit: "W" },
    {
      id: "radarCrossSectionM2",
      kind: "number",
      label: "Radar cross section",
      unit: "m²",
    },
    { id: "rangeMeters", kind: "number", label: "Range", unit: "m" },
    { id: "wavelengthMeters", kind: "number", label: "Wavelength", unit: "m" },
  ],
  outputs: [
    {
      id: "receivedPowerWatts",
      kind: "number",
      label: "Received power",
      unit: "W",
    },
  ],
  title: "Radar Received Power",
});
export const runRadarReceivedPower = radarReceivedPowerTool.execute;
export default radarReceivedPowerTool;
