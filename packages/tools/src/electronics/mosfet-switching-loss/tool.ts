import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetSwitchingLossInput = {
  readonly drainCurrentA: number;
  readonly switchingFreqKhz: number;
  readonly supplyVolts: number;
  readonly tfallNs: number;
  readonly triseNs: number;
};

export type MosfetSwitchingLossOutput = {
  readonly switchingLossWatts: number;
};

export const mosfetSwitchingLossExample = {
  input: {
    drainCurrentA: 2,
    switchingFreqKhz: 100,
    supplyVolts: 24,
    tfallNs: 40,
    triseNs: 50,
  },
  output: { switchingLossWatts: 0.21600000000000005 },
} satisfies ToolExample<MosfetSwitchingLossInput, MosfetSwitchingLossOutput>;

export const mosfetSwitchingLossTool = createSimpleTool({
  calculate: (input) => {
    const supplyVolts = input.supplyVolts as number;
    const drainCurrentA = input.drainCurrentA as number;
    const triseNs = input.triseNs as number;
    const tfallNs = input.tfallNs as number;
    const switchingFreqKhz = input.switchingFreqKhz as number;
    if (!(supplyVolts > 0))
      simpleError(
        "supplyVolts",
        "Supply voltage must be positive.",
        "invalid_supply",
      );
    if (!(drainCurrentA >= 0))
      simpleError(
        "drainCurrentA",
        "Drain current must not be negative.",
        "invalid_current",
      );
    if (!(triseNs > 0))
      simpleError("triseNs", "Rise time must be positive.", "invalid_time");
    if (!(tfallNs > 0))
      simpleError("tfallNs", "Fall time must be positive.", "invalid_time");
    if (!(switchingFreqKhz > 0))
      simpleError(
        "switchingFreqKhz",
        "Switching frequency must be positive.",
        "invalid_frequency",
      );
    return {
      switchingLossWatts:
        0.5 *
        supplyVolts *
        drainCurrentA *
        ((triseNs + tfallNs) * 1e-9) *
        (switchingFreqKhz * 1e3),
    };
  },
  description:
    "Compute MOSFET switching loss as 0.5 x V x I x (tr + tf) x f for hard-switched transitions.",
  id: "electronics/mosfet-switching-loss",
  inputs: [
    { id: "supplyVolts", kind: "number", label: "Supply voltage", unit: "V" },
    { id: "drainCurrentA", kind: "number", label: "Drain current", unit: "A" },
    { id: "triseNs", kind: "number", label: "Rise time", unit: "ns" },
    { id: "tfallNs", kind: "number", label: "Fall time", unit: "ns" },
    {
      id: "switchingFreqKhz",
      kind: "number",
      label: "Switching frequency",
      unit: "kHz",
    },
  ],
  outputs: [
    {
      id: "switchingLossWatts",
      kind: "number",
      label: "Switching loss",
      unit: "W",
    },
  ],
  title: "MOSFET Switching Loss",
});
export const runMosfetSwitchingLoss = mosfetSwitchingLossTool.execute;
export default mosfetSwitchingLossTool;
