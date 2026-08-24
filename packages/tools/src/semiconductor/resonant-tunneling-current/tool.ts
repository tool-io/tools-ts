import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResonantTunnelingCurrentInput = {
  readonly peakCurrentMa: number;
  readonly valleyCurrentMa: number;
};

export type ResonantTunnelingCurrentOutput = {
  readonly peakToValleyRatio: number;
};

export const resonantTunnelingCurrentExample = {
  input: { peakCurrentMa: 10, valleyCurrentMa: 2 },
  output: { peakToValleyRatio: 5 },
} satisfies ToolExample<
  ResonantTunnelingCurrentInput,
  ResonantTunnelingCurrentOutput
>;

export const resonantTunnelingCurrentTool = createSimpleTool({
  id: "semiconductor/resonant-tunneling-current",
  title: "RTD Peak-to-Valley Ratio",
  description:
    "Compute the peak-to-valley current ratio of a resonant tunneling diode from its peak and valley currents.",
  inputs: [
    {
      description: "Current at the resonant peak.",
      id: "peakCurrentMa",
      kind: "number",
      label: "Peak current",
      unit: "mA",
    },
    {
      description: "Current in the valley between peaks.",
      id: "valleyCurrentMa",
      kind: "number",
      label: "Valley current",
      unit: "mA",
    },
  ],
  outputs: [
    {
      description: "Ratio of peak to valley current; higher is better.",
      format: "factor",
      id: "peakToValleyRatio",
      kind: "number",
      label: "Peak-to-valley ratio",
    },
  ],
  calculate: (input) => {
    const peakCurrentMa = input.peakCurrentMa as number;
    const valleyCurrentMa = input.valleyCurrentMa as number;
    if (!(peakCurrentMa > 0))
      simpleError("peakCurrentMa", "Peak current must be greater than zero.");
    if (!(valleyCurrentMa > 0))
      simpleError(
        "valleyCurrentMa",
        "Valley current must be greater than zero.",
      );
    if (peakCurrentMa < valleyCurrentMa)
      simpleError(
        "peakCurrentMa",
        "Peak current must be greater than or equal to valley current.",
        "invalid_peak_current",
      );
    const peakToValleyRatio = peakCurrentMa / valleyCurrentMa;
    if (!Number.isFinite(peakToValleyRatio))
      simpleError(
        "valleyCurrentMa",
        "Peak-to-valley ratio is outside the numeric range.",
        "invalid_ratio",
      );
    return { peakToValleyRatio };
  },
});
export const runResonantTunnelingCurrent = resonantTunnelingCurrentTool.execute;
export default resonantTunnelingCurrentTool;
