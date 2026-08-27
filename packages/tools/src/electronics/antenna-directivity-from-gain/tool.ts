import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antennaDirectivityFromGainExample = {
  input: { gainDbi: 12 },
} satisfies ToolExample<{
  readonly efficiencyFraction?: number;
  readonly gainDbi: number;
}>;

export const antennaDirectivityFromGainTool = createSimpleTool({
  id: "electronics/antenna-directivity-from-gain",
  title: "Directivity From Gain",
  description:
    "Recover antenna directivity as directivityDbi = gainDbi - 10 * log10(efficiencyFraction), with efficiency defaulting to 0.6.",
  inputs: [
    {
      description: "Measured antenna gain.",
      id: "gainDbi",
      kind: "number",
      label: "Gain",
      unit: "dBi",
    },
    {
      default: 0.6,
      description:
        "Radiation efficiency as a fraction strictly between zero and one.",
      id: "efficiencyFraction",
      kind: "number",
      label: "Efficiency Fraction",
      maximum: 1,
      minimum: 0,
      required: false,
    },
  ],
  outputs: [
    {
      description: "Antenna directivity.",
      id: "directivityDbi",
      kind: "number",
      label: "Directivity",
      unit: "dBi",
    },
  ],
  calculate: (input) => {
    const efficiencyFraction = input.efficiencyFraction as number;
    if (!(efficiencyFraction > 0) || !(efficiencyFraction < 1))
      simpleError(
        "efficiencyFraction",
        "Efficiency fraction must lie strictly between zero and one.",
      );
    return {
      directivityDbi:
        (input.gainDbi as number) - 10 * Math.log10(efficiencyFraction),
    };
  },
});
export const runAntennaDirectivityFromGain =
  antennaDirectivityFromGainTool.execute;
export default antennaDirectivityFromGainTool;
