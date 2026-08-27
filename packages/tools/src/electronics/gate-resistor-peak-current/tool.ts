import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GateResistorPeakCurrentInput = {
  readonly driverVolts: number;
  readonly gateResistorOhms: number;
};

export type GateResistorPeakCurrentOutput = {
  readonly gatePeakCurrentA: number;
};

export const gateResistorPeakCurrentExample = {
  input: { driverVolts: 12, gateResistorOhms: 10 },
  output: { gatePeakCurrentA: 1.2 },
} satisfies ToolExample<
  GateResistorPeakCurrentInput,
  GateResistorPeakCurrentOutput
>;

export const gateResistorPeakCurrentTool = createSimpleTool({
  calculate: (input) => {
    const driverVolts = input.driverVolts as number;
    const gateResistorOhms = input.gateResistorOhms as number;
    if (!(driverVolts > 0))
      simpleError(
        "driverVolts",
        "Driver voltage must be positive.",
        "invalid_voltage",
      );
    if (!(gateResistorOhms > 0))
      simpleError(
        "gateResistorOhms",
        "Gate resistor must be positive.",
        "invalid_resistance",
      );
    return {
      gatePeakCurrentA: driverVolts / gateResistorOhms,
    };
  },
  description:
    "Compute the peak MOSFET gate current as the gate driver voltage divided by the gate resistor.",
  id: "electronics/gate-resistor-peak-current",
  inputs: [
    { id: "driverVolts", kind: "number", label: "Driver voltage", unit: "V" },
    {
      id: "gateResistorOhms",
      kind: "number",
      label: "Gate resistor",
      unit: "ohm",
    },
  ],
  outputs: [
    {
      id: "gatePeakCurrentA",
      kind: "number",
      label: "Peak gate current",
      unit: "A",
    },
  ],
  title: "Gate Peak Current",
});
export const runGateResistorPeakCurrent = gateResistorPeakCurrentTool.execute;
export default gateResistorPeakCurrentTool;
