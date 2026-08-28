import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const radarCrossSectionExample = {
  input: {
    gainLinear: 100,
    ptxWatts: 1000,
    rangeMeters: 1000,
    receivedWatts: 1e-12,
    wavelengthMeters: 0.03,
  },
} satisfies ToolExample<{
  readonly gainLinear: number;
  readonly ptxWatts: number;
  readonly rangeMeters: number;
  readonly receivedWatts: number;
  readonly wavelengthMeters: number;
}>;

export const radarCrossSectionTool = createSimpleTool({
  id: "electronics/radar-cross-section",
  title: "RCS From Power Ratio",
  description:
    "Compute radar cross section from the received power via the radar range equation sigma = Pr x (4pi)^3 x R^4 / (Pt x G^2 x lambda^2).",
  inputs: [
    {
      id: "receivedWatts",
      label: "Received power",
      kind: "number",
      unit: "W",
    },
    {
      id: "ptxWatts",
      label: "Transmit power",
      kind: "number",
      unit: "W",
    },
    { id: "gainLinear", label: "Antenna gain", kind: "number" },
    { id: "rangeMeters", label: "Range", kind: "number", unit: "m" },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "radarCrossSectionM2",
      label: "Radar cross section",
      kind: "number",
      unit: "m\u00b2",
    },
  ],
  calculate: (input) => {
    const receivedWatts = input.receivedWatts as number;
    const ptxWatts = input.ptxWatts as number;
    const gainLinear = input.gainLinear as number;
    const rangeMeters = input.rangeMeters as number;
    const wavelengthMeters = input.wavelengthMeters as number;
    if (!(receivedWatts > 0))
      simpleError("receivedWatts", "Received power must be positive.");
    if (!(ptxWatts > 0))
      simpleError("ptxWatts", "Transmit power must be positive.");
    if (!(gainLinear > 0))
      simpleError("gainLinear", "Antenna gain must be positive.");
    if (!(rangeMeters > 0))
      simpleError("rangeMeters", "Range must be positive.");
    if (!(wavelengthMeters > 0))
      simpleError("wavelengthMeters", "Wavelength must be positive.");
    return {
      radarCrossSectionM2:
        (receivedWatts * Math.pow(4 * Math.PI, 3) * Math.pow(rangeMeters, 4)) /
        (ptxWatts * gainLinear ** 2 * wavelengthMeters ** 2),
    };
  },
});
export const runRadarCrossSection = radarCrossSectionTool.execute;
export default radarCrossSectionTool;
