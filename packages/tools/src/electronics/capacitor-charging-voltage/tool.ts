import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorChargingVoltageInput = {
  readonly capacitanceF: number;
  readonly resistanceOhms: number;
  readonly supplyVolts: number;
  readonly timeSeconds: number;
};

export type CapacitorChargingVoltageOutput = {
  readonly capacitorVoltage: number;
};

export const capacitorChargingVoltageExample = {
  input: {
    capacitanceF: 0.001,
    resistanceOhms: 1000,
    supplyVolts: 5,
    timeSeconds: 1,
  },
  output: { capacitorVoltage: 3.1606027941427883 },
} satisfies ToolExample<
  CapacitorChargingVoltageInput,
  CapacitorChargingVoltageOutput
>;

export const capacitorChargingVoltageTool = createSimpleTool({
  calculate: (input) => {
    const { capacitanceF, resistanceOhms, supplyVolts, timeSeconds } =
      input as unknown as CapacitorChargingVoltageInput;
    if (resistanceOhms <= 0)
      simpleError(
        "resistanceOhms",
        "Resistance must be positive.",
        "degenerate_input",
      );
    if (capacitanceF <= 0)
      simpleError(
        "capacitanceF",
        "Capacitance must be positive.",
        "degenerate_input",
      );
    if (timeSeconds < 0)
      simpleError(
        "timeSeconds",
        "Time cannot be negative.",
        "degenerate_input",
      );
    return {
      capacitorVoltage:
        supplyVolts *
        (1 - Math.exp(-timeSeconds / (resistanceOhms * capacitanceF))),
    };
  },
  description:
    "Compute the charging voltage across an RC network after a given elapsed time.",
  id: "electronics/capacitor-charging-voltage",
  inputs: [
    { id: "supplyVolts", kind: "number", label: "Supply voltage", unit: "V" },
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "ohm" },
    { id: "capacitanceF", kind: "number", label: "Capacitance", unit: "F" },
    { id: "timeSeconds", kind: "number", label: "Time", unit: "s" },
  ],
  outputs: [
    {
      id: "capacitorVoltage",
      kind: "number",
      label: "Capacitor voltage",
      unit: "V",
    },
  ],
  title: "RC Charging Voltage",
});
export const runCapacitorChargingVoltage = capacitorChargingVoltageTool.execute;
export default capacitorChargingVoltageTool;
