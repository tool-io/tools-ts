import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerModuleLossSwitchingTotalInput = Readonly<{
  readonly turnOnEnergyJ: number;
  readonly turnOffEnergyJ: number;
  readonly switchingFrequencyHz: number;
}>;
export type PowerModuleLossSwitchingTotalOutput = Readonly<{
  switchingLossW: number;
}>;

export const calculatePowerModuleLossSwitchingTotal = (
  i: PowerModuleLossSwitchingTotalInput,
): PowerModuleLossSwitchingTotalOutput => {
  const value = (i.turnOnEnergyJ + i.turnOffEnergyJ) * i.switchingFrequencyHz;
  if (!Number.isFinite(value))
    simpleError("switchingLossW", "The inputs produce a non-finite result.");
  return { switchingLossW: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    turnOnEnergyJ: 0.002,
    turnOffEnergyJ: 0.003,
    switchingFrequencyHz: 10000,
  },
  output: { switchingLossW: 50 },
} satisfies ToolExample<
  PowerModuleLossSwitchingTotalInput,
  PowerModuleLossSwitchingTotalOutput
>;

export const tool = createSimpleTool({
  id: "electronics/power-module-loss-switching-total",
  title: "Power Module Loss Switching Total",
  description:
    "Calculate average power-module switching loss from per-event turn-on and turn-off energies times switching frequency.",
  inputs: [
    {
      id: "turnOnEnergyJ",
      kind: "number",
      label: "Turn On Energy (J)",
      unit: "J",
      minimum: 0,
    },
    {
      id: "turnOffEnergyJ",
      kind: "number",
      label: "Turn Off Energy (J)",
      unit: "J",
      minimum: 0,
    },
    {
      id: "switchingFrequencyHz",
      kind: "number",
      label: "Switching Frequency (Hz)",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "switchingLossW",
      kind: "number",
      label: "Switching Loss (W)",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculatePowerModuleLossSwitchingTotal({
      turnOnEnergyJ: input.turnOnEnergyJ as number,
      turnOffEnergyJ: input.turnOffEnergyJ as number,
      switchingFrequencyHz: input.switchingFrequencyHz as number,
    }),
});
export const powerModuleLossSwitchingTotalTool = tool;
export const runPowerModuleLossSwitchingTotal = tool.execute;
export default tool;
