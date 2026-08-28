import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SnubberCapacitorInput = {
  readonly switchCurrentA: number;
  readonly turnOffTimeNs: number;
  readonly voltageSpikeVolts: number;
};

export type SnubberCapacitorOutput = {
  readonly snubberCapacitanceNf: number;
};

export const snubberCapacitorExample = {
  input: { switchCurrentA: 1, turnOffTimeNs: 50, voltageSpikeVolts: 100 },
  output: { snubberCapacitanceNf: 0.5 },
} satisfies ToolExample<SnubberCapacitorInput, SnubberCapacitorOutput>;

export const snubberCapacitorTool = createSimpleTool({
  calculate: (input) => {
    const switchCurrentA = input.switchCurrentA as number;
    const turnOffTimeNs = input.turnOffTimeNs as number;
    const voltageSpikeVolts = input.voltageSpikeVolts as number;
    if (!(switchCurrentA > 0))
      simpleError(
        "switchCurrentA",
        "Switch current must be positive.",
        "invalid_current",
      );
    if (!(turnOffTimeNs > 0))
      simpleError(
        "turnOffTimeNs",
        "Turn-off time must be positive.",
        "invalid_time",
      );
    if (!(voltageSpikeVolts > 0))
      simpleError(
        "voltageSpikeVolts",
        "Voltage spike must be positive.",
        "invalid_voltage",
      );
    return {
      snubberCapacitanceNf:
        ((switchCurrentA * (turnOffTimeNs * 1e-9)) / voltageSpikeVolts) * 1e9,
    };
  },
  description:
    "Compute the snubber capacitance C = I_off x dt / V_spike that limits the turn-off voltage spike.",
  id: "electronics/snubber-capacitor",
  inputs: [
    {
      id: "switchCurrentA",
      kind: "number",
      label: "Switch current at turn-off",
      unit: "A",
    },
    {
      id: "turnOffTimeNs",
      kind: "number",
      label: "Turn-off (rise) time",
      unit: "ns",
    },
    {
      id: "voltageSpikeVolts",
      kind: "number",
      label: "Allowed voltage spike",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "snubberCapacitanceNf",
      kind: "number",
      label: "Snubber capacitance",
      unit: "nF",
    },
  ],
  title: "Snubber Capacitor Value",
});
export const runSnubberCapacitor = snubberCapacitorTool.execute;
export default snubberCapacitorTool;
