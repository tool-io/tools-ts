import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetConductionLossInput = {
  readonly drainCurrentRmsA: number;
  readonly rdsonOhms: number;
};

export type MosfetConductionLossOutput = {
  readonly conductionLossWatts: number;
};

export const mosfetConductionLossExample = {
  input: { drainCurrentRmsA: 3, rdsonOhms: 0.01 },
  output: { conductionLossWatts: 0.09 },
} satisfies ToolExample<MosfetConductionLossInput, MosfetConductionLossOutput>;

export const mosfetConductionLossTool = createSimpleTool({
  calculate: (input) => {
    const drainCurrentRmsA = input.drainCurrentRmsA as number;
    const rdsonOhms = input.rdsonOhms as number;
    if (!(drainCurrentRmsA > 0))
      simpleError(
        "drainCurrentRmsA",
        "RMS drain current must be positive.",
        "invalid_current",
      );
    if (!(rdsonOhms > 0))
      simpleError(
        "rdsonOhms",
        "RDS(on) must be positive.",
        "invalid_resistance",
      );
    return {
      conductionLossWatts: drainCurrentRmsA ** 2 * rdsonOhms,
    };
  },
  description:
    "Compute MOSFET conduction loss as the square of RMS drain current times RDS(on).",
  id: "electronics/mosfet-conduction-loss",
  inputs: [
    {
      id: "drainCurrentRmsA",
      kind: "number",
      label: "RMS drain current",
      unit: "A",
    },
    { id: "rdsonOhms", kind: "number", label: "RDS(on)", unit: "ohm" },
  ],
  outputs: [
    {
      id: "conductionLossWatts",
      kind: "number",
      label: "Conduction loss",
      unit: "W",
    },
  ],
  title: "Conduction Loss",
});
export const runMosfetConductionLoss = mosfetConductionLossTool.execute;
export default mosfetConductionLossTool;
