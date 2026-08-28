import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerSupplyHoldupCapacitorInput = {
  readonly busVolts: number;
  readonly holdupMs: number;
  readonly minBusVolts: number;
  readonly outputPowerW: number;
};

export type PowerSupplyHoldupCapacitorOutput = {
  readonly holdupCapacitanceUf: number;
};

export const powerSupplyHoldupCapacitorExample = {
  input: {
    busVolts: 400,
    holdupMs: 20,
    minBusVolts: 380,
    outputPowerW: 10,
  },
  output: { holdupCapacitanceUf: 0.02564102564102564 },
} satisfies ToolExample<
  PowerSupplyHoldupCapacitorInput,
  PowerSupplyHoldupCapacitorOutput
>;

export const calculatePowerSupplyHoldupCapacitor = (
  input: PowerSupplyHoldupCapacitorInput,
): PowerSupplyHoldupCapacitorOutput => {
  if (!(input.outputPowerW > 0))
    simpleError(
      "outputPowerW",
      "Output power must be positive.",
      "invalid_power",
    );
  if (!(input.holdupMs > 0))
    simpleError(
      "holdupMs",
      "Holdup time must be positive.",
      "invalid_holdup_time",
    );
  if (!(input.minBusVolts > 0))
    simpleError(
      "minBusVolts",
      "Minimum bus voltage must be positive.",
      "invalid_voltage",
    );
  if (!(input.busVolts > input.minBusVolts))
    simpleError(
      "busVolts",
      "Bus voltage must exceed the minimum bus voltage.",
      "invalid_voltage",
    );
  return {
    holdupCapacitanceUf:
      (input.outputPowerW * input.holdupMs * 2) /
      (input.busVolts * input.busVolts - input.minBusVolts * input.minBusVolts),
  };
};

export const powerSupplyHoldupCapacitorTool = createSimpleTool({
  calculate: (input) =>
    calculatePowerSupplyHoldupCapacitor(
      input as unknown as PowerSupplyHoldupCapacitorInput,
    ),
  description:
    "Compute the bulk capacitance needed to hold up a power supply output for a ride-through interval.",
  id: "electronics/power-supply-holdup-capacitor",
  inputs: [
    {
      description: "Power delivered by the supply during holdup.",
      format: "power",
      id: "outputPowerW",
      kind: "number",
      label: "Output power",
      unit: "W",
    },
    {
      description: "Ride-through interval the bus must sustain.",
      format: "time",
      id: "holdupMs",
      kind: "number",
      label: "Holdup time",
      unit: "ms",
    },
    {
      description: "Nominal DC bus voltage before the dropout.",
      format: "voltage",
      id: "busVolts",
      kind: "number",
      label: "Bus voltage",
      unit: "V",
    },
    {
      description: "Lowest bus voltage the load still accepts.",
      format: "voltage",
      id: "minBusVolts",
      kind: "number",
      label: "Minimum bus voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Required bulk capacitance.",
      format: "capacitance",
      id: "holdupCapacitanceUf",
      kind: "number",
      label: "Holdup capacitance",
      unit: "µF",
    },
  ],
  title: "PSU Holdup Cap",
});
export const runPowerSupplyHoldupCapacitor =
  powerSupplyHoldupCapacitorTool.execute;
export default powerSupplyHoldupCapacitorTool;
