import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelayOperateTimeInput = {
  readonly coilInductanceMH: number;
  readonly coilResistanceOhms: number;
  readonly pickupVolts: number;
  readonly supplyVolts: number;
};

export type RelayOperateTimeOutput = {
  readonly operateTimeMs: number;
};

export const relayOperateTimeExample = {
  input: {
    coilInductanceMH: 50,
    coilResistanceOhms: 100,
    pickupVolts: 6,
    supplyVolts: 12,
  },
  output: { operateTimeMs: 346.5735902799726 },
} satisfies ToolExample<RelayOperateTimeInput, RelayOperateTimeOutput>;

export const calculateRelayOperateTime = (
  input: RelayOperateTimeInput,
): RelayOperateTimeOutput => {
  if (!(input.coilInductanceMH > 0))
    simpleError(
      "coilInductanceMH",
      "Coil inductance must be positive.",
      "invalid_inductance",
    );
  if (!(input.coilResistanceOhms > 0))
    simpleError(
      "coilResistanceOhms",
      "Coil resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.supplyVolts > 0))
    simpleError(
      "supplyVolts",
      "Supply voltage must be positive.",
      "invalid_supply",
    );
  if (!(input.pickupVolts < input.supplyVolts))
    simpleError(
      "pickupVolts",
      "Pickup voltage must be below the supply voltage.",
      "insufficient_supply",
    );
  return {
    operateTimeMs:
      (input.coilInductanceMH / input.coilResistanceOhms) *
      Math.log(input.supplyVolts / (input.supplyVolts - input.pickupVolts)) *
      1000,
  };
};

export const relayOperateTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateRelayOperateTime(input as unknown as RelayOperateTimeInput),
  description:
    "Estimate how long an RL relay coil takes to reach its pickup voltage from the L/R time constant.",
  id: "electronics/relay-operate-time",
  inputs: [
    {
      description: "Inductance of the relay coil.",
      format: "inductance",
      id: "coilInductanceMH",
      kind: "number",
      label: "Coil inductance",
      unit: "mH",
    },
    {
      description: "DC resistance of the relay coil.",
      format: "resistance",
      id: "coilResistanceOhms",
      kind: "number",
      label: "Coil resistance",
      unit: "Ω",
    },
    {
      description: "Voltage at which the relay must pick up.",
      format: "voltage",
      id: "pickupVolts",
      kind: "number",
      label: "Pickup voltage",
      unit: "V",
    },
    {
      description: "Applied supply voltage.",
      format: "voltage",
      id: "supplyVolts",
      kind: "number",
      label: "Supply voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Estimated time for coil current to reach pickup.",
      format: "time",
      id: "operateTimeMs",
      kind: "number",
      label: "Operate time",
      unit: "ms",
    },
  ],
  title: "Relay Operate Time",
});
export const runRelayOperateTime = relayOperateTimeTool.execute;
export default relayOperateTimeTool;
