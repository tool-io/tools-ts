import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const freeSpacePathLossExample = {
  input: { distanceKm: 10, frequencyMHz: 1000 },
} satisfies ToolExample<{
  readonly distanceKm: number;
  readonly frequencyMHz: number;
}>;

export const freeSpacePathLossTool = createSimpleTool({
  id: "electronics/free-space-path-loss",
  title: "FSPL Calculator",
  description:
    "Calculate free-space path loss in decibels for a link distance and frequency.",
  inputs: [
    { id: "distanceKm", label: "Distance", kind: "number" },
    { id: "frequencyMHz", label: "Frequency", kind: "number" },
  ],
  outputs: [{ id: "pathLossDb", label: "Path loss", kind: "number" }],
  calculate: (input) => {
    const distanceKm = input.distanceKm as number;
    const frequencyMHz = input.frequencyMHz as number;
    if (distanceKm <= 0)
      simpleError("distanceKm", "Distance must be greater than zero.");
    if (frequencyMHz <= 0)
      simpleError("frequencyMHz", "Frequency must be greater than zero.");
    return {
      pathLossDb:
        20 * Math.log10(distanceKm) + 20 * Math.log10(frequencyMHz) + 32.44,
    };
  },
});
export const runFreeSpacePathLoss = freeSpacePathLossTool.execute;
export default freeSpacePathLossTool;
