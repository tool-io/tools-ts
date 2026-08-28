import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WirePowerLossInput = {
  readonly crossSectionMm2: number;
  readonly currentAmps: number;
  readonly resistivityOhmMm2PerM: number;
  readonly wireLengthMeters: number;
};

export type WirePowerLossOutput = {
  readonly powerLossWatts: number;
};

export const wirePowerLossExample = {
  input: {
    crossSectionMm2: 1.5,
    currentAmps: 5,
    resistivityOhmMm2PerM: 0.0175,
    wireLengthMeters: 20,
  },
  output: { powerLossWatts: 11.666666666666668 },
} satisfies ToolExample<WirePowerLossInput, WirePowerLossOutput>;

export const wirePowerLossTool = createSimpleTool({
  calculate: (input) => {
    const {
      crossSectionMm2,
      currentAmps,
      resistivityOhmMm2PerM,
      wireLengthMeters,
    } = input as unknown as WirePowerLossInput;
    if (wireLengthMeters <= 0)
      simpleError(
        "wireLengthMeters",
        "Wire length must be positive.",
        "degenerate_input",
      );
    if (resistivityOhmMm2PerM <= 0)
      simpleError(
        "resistivityOhmMm2PerM",
        "Resistivity must be positive.",
        "degenerate_input",
      );
    if (crossSectionMm2 <= 0)
      simpleError(
        "crossSectionMm2",
        "Cross-section must be positive.",
        "degenerate_input",
      );
    const dropResistanceOhms =
      (2 * wireLengthMeters * resistivityOhmMm2PerM) / crossSectionMm2;
    return { powerLossWatts: currentAmps ** 2 * dropResistanceOhms };
  },
  description:
    "Compute the ohmic power dissipated in a round-trip wire run at a given current.",
  id: "electronics/wire-power-loss",
  inputs: [
    { id: "currentAmps", kind: "number", label: "Current", unit: "A" },
    { id: "wireLengthMeters", kind: "number", label: "Wire length", unit: "m" },
    {
      id: "resistivityOhmMm2PerM",
      kind: "number",
      label: "Wire resistivity",
      unit: "ohm*mm^2/m",
    },
    {
      id: "crossSectionMm2",
      kind: "number",
      label: "Cross-section",
      unit: "mm^2",
    },
  ],
  outputs: [
    { id: "powerLossWatts", kind: "number", label: "Power loss", unit: "W" },
  ],
  title: "Wire Power Loss",
});
export const runWirePowerLoss = wirePowerLossTool.execute;
export default wirePowerLossTool;
