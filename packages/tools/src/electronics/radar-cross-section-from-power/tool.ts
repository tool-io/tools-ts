import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const FOUR_PI_CUBED = 1984.4017075393682;

export const radarCrossSectionFromPowerExample = {
  input: {
    antennaGainLinear: 30,
    ptxWatts: 1000,
    prxWatts: 1e-12,
    rangeMeters: 1000,
    wavelengthMeters: 0.03,
  },
} satisfies ToolExample<{
  readonly antennaGainLinear: number;
  readonly prxWatts: number;
  readonly ptxWatts: number;
  readonly rangeMeters: number;
  readonly wavelengthMeters: number;
}>;

export const radarCrossSectionFromPowerTool = createSimpleTool({
  id: "electronics/radar-cross-section-from-power",
  title: "RCS From Received Power",
  description:
    "Solve the radar equation for target cross section rcsM2 = Prx * (4*pi)^3 * R^4 / (Ptx * G^2 * lambda^2) with all linear units.",
  inputs: [
    {
      description: "Received echo power.",
      id: "prxWatts",
      kind: "number",
      label: "Received Power",
      unit: "W",
    },
    {
      description: "Transmitted peak power.",
      id: "ptxWatts",
      kind: "number",
      label: "Transmit Power",
      unit: "W",
    },
    {
      description: "Range to the target.",
      id: "rangeMeters",
      kind: "number",
      label: "Range",
      unit: "m",
    },
    {
      description: "Antenna gain, linear.",
      id: "antennaGainLinear",
      kind: "number",
      label: "Antenna Gain",
    },
    {
      description: "Operating wavelength.",
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Estimated radar cross section.",
      id: "computedRcsM2",
      kind: "number",
      label: "RCS",
      unit: "m^2",
    },
  ],
  calculate: (input) => {
    const prxWatts = input.prxWatts as number;
    const ptxWatts = input.ptxWatts as number;
    const rangeMeters = input.rangeMeters as number;
    const antennaGainLinear = input.antennaGainLinear as number;
    const wavelengthMeters = input.wavelengthMeters as number;
    if (
      !(prxWatts > 0) ||
      !(ptxWatts > 0) ||
      !(rangeMeters > 0) ||
      !(antennaGainLinear > 0) ||
      !(wavelengthMeters > 0)
    )
      simpleError(
        "prxWatts",
        "All powers, range, gain, and wavelength must be positive.",
      );
    return {
      computedRcsM2:
        (prxWatts *
          FOUR_PI_CUBED *
          rangeMeters *
          rangeMeters *
          rangeMeters *
          rangeMeters) /
        (ptxWatts *
          antennaGainLinear *
          antennaGainLinear *
          wavelengthMeters *
          wavelengthMeters),
    };
  },
});
export const runRadarCrossSectionFromPower =
  radarCrossSectionFromPowerTool.execute;
export default radarCrossSectionFromPowerTool;
