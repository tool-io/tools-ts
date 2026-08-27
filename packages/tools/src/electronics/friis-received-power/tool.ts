import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const friisReceivedPowerExample = {
  input: {
    distanceKm: 10,
    frequencyMHz: 1000,
    grxDb: 5,
    gtxDb: 10,
    ptxDbm: 20,
  },
} satisfies ToolExample<{
  readonly distanceKm: number;
  readonly frequencyMHz: number;
  readonly grxDb: number;
  readonly gtxDb: number;
  readonly ptxDbm: number;
}>;

export const friisReceivedPowerTool = createSimpleTool({
  id: "electronics/friis-received-power",
  title: "Friis Received Power",
  description:
    "Calculate received power for a line-of-sight link using the Friis transmission equation.",
  inputs: [
    { id: "ptxDbm", label: "TX power", kind: "number" },
    { id: "gtxDb", label: "TX antenna gain", kind: "number" },
    { id: "grxDb", label: "RX antenna gain", kind: "number" },
    { id: "distanceKm", label: "Distance", kind: "number" },
    { id: "frequencyMHz", label: "Frequency", kind: "number" },
  ],
  outputs: [
    { id: "receivedPowerDbm", label: "Received power", kind: "number" },
  ],
  calculate: (input) => {
    const ptxDbm = input.ptxDbm as number;
    const gtxDb = input.gtxDb as number;
    const grxDb = input.grxDb as number;
    const distanceKm = input.distanceKm as number;
    const frequencyMHz = input.frequencyMHz as number;
    if (distanceKm <= 0)
      simpleError("distanceKm", "Distance must be greater than zero.");
    if (frequencyMHz <= 0)
      simpleError("frequencyMHz", "Frequency must be greater than zero.");
    return {
      receivedPowerDbm:
        ptxDbm +
        gtxDb +
        grxDb -
        20 * Math.log10(distanceKm) -
        20 * Math.log10(frequencyMHz) -
        32.44,
    };
  },
});
export const runFriisReceivedPower = friisReceivedPowerTool.execute;
export default friisReceivedPowerTool;
