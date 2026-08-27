import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorDischargingVoltageInput = {
  readonly capacitanceF: number;
  readonly initialVolts: number;
  readonly resistanceOhms: number;
  readonly timeSeconds: number;
};

export type CapacitorDischargingVoltageOutput = {
  readonly capacitorVoltage: number;
};

export const capacitorDischargingVoltageExample = {
  input: {
    capacitanceF: 0.001,
    initialVolts: 9,
    resistanceOhms: 1000,
    timeSeconds: 2,
  },
  output: { capacitorVoltage: 1.2180175491295144 },
} satisfies ToolExample<
  CapacitorDischargingVoltageInput,
  CapacitorDischargingVoltageOutput
>;

export const capacitorDischargingVoltageTool = createSimpleTool({
  calculate: (input) => {
    const { capacitanceF, initialVolts, resistanceOhms, timeSeconds } =
      input as unknown as CapacitorDischargingVoltageInput;
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
        initialVolts * Math.exp(-timeSeconds / (resistanceOhms * capacitanceF)),
    };
  },
  description:
    "Compute the remaining voltage across a discharging RC network after a given elapsed time.",
  id: "electronics/capacitor-discharging-voltage",
  inputs: [
    { id: "initialVolts", kind: "number", label: "Initial voltage", unit: "V" },
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
  title: "RC Discharging Voltage",
});
export const runCapacitorDischargingVoltage =
  capacitorDischargingVoltageTool.execute;
export default capacitorDischargingVoltageTool;
