import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VoltSecondBalanceInput = {
  readonly tOffNs: number;
  readonly tOnNs: number;
  readonly vOffVolts: number;
  readonly vOnVolts: number;
};

export type VoltSecondBalanceOutput = {
  readonly balanced: boolean;
  readonly voltSecondImbalanceFraction: number;
};

export const voltSecondBalanceExample = {
  input: { tOffNs: 3000, tOnNs: 5000, vOffVolts: 20, vOnVolts: 12 },
  output: { balanced: true, voltSecondImbalanceFraction: 0 },
} satisfies ToolExample<VoltSecondBalanceInput, VoltSecondBalanceOutput>;

export const calculateVoltSecondBalance = (
  input: VoltSecondBalanceInput,
): VoltSecondBalanceOutput => {
  if (!(input.vOnVolts > 0) || !(input.vOffVolts > 0))
    simpleError(
      "vOnVolts",
      "Applied and reflected voltages must be positive.",
      "invalid_voltage",
    );
  if (!(input.tOnNs > 0) || !(input.tOffNs > 0))
    simpleError("tOnNs", "Durations must be positive.", "invalid_duration");
  const voltSecondImbalanceFraction =
    Math.abs(input.vOnVolts * input.tOnNs - input.vOffVolts * input.tOffNs) /
    (input.vOnVolts * input.tOnNs);
  return {
    balanced: voltSecondImbalanceFraction < 0.05,
    voltSecondImbalanceFraction,
  };
};

export const voltSecondBalanceTool = createSimpleTool({
  calculate: (input) =>
    calculateVoltSecondBalance(input as unknown as VoltSecondBalanceInput),
  description:
    "Check transformer volt-second balance as |v_on x t_on - v_off x t_off| / (v_on x t_on); balanced when the fraction is below 0.05.",
  id: "electronics/volt-second-balance",
  inputs: [
    { id: "tOffNs", kind: "number", label: "Off time", unit: "ns" },
    { id: "tOnNs", kind: "number", label: "On time", unit: "ns" },
    {
      id: "vOffVolts",
      kind: "number",
      label: "Off (reflected) voltage",
      unit: "V",
    },
    { id: "vOnVolts", kind: "number", label: "On voltage", unit: "V" },
  ],
  outputs: [
    {
      id: "voltSecondImbalanceFraction",
      kind: "number",
      label: "Volt-second imbalance",
    },
    { id: "balanced", kind: "boolean", label: "Balanced" },
  ],
  title: "Volt-Second Balance Check",
});
export const runVoltSecondBalance = voltSecondBalanceTool.execute;
export default voltSecondBalanceTool;
