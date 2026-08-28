import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeriesCapacitorVoltageInput = {
  readonly supplyVolts: number;
  readonly c1: number;
  readonly c2: number;
};

export type SeriesCapacitorVoltageOutput = {
  readonly voltageAcrossC1V: number;
};

export const seriesCapacitorVoltageExample = {
  input: { supplyVolts: 12, c1: 0.000001, c2: 0.000003 },
  output: { voltageAcrossC1V: 9 },
} satisfies ToolExample<
  SeriesCapacitorVoltageInput,
  SeriesCapacitorVoltageOutput
>;

export const seriesCapacitorVoltageTool = createSimpleTool({
  id: "electronics/series-capacitor-voltage",
  title: "Series Cap Voltage Divider",
  description:
    "Compute the voltage across C1 of a series pair as supply volts times C2 / (C1 + C2).",
  inputs: [
    { id: "supplyVolts", label: "Supply voltage", kind: "number", unit: "V" },
    { id: "c1", label: "Capacitance C1", kind: "number", unit: "F" },
    { id: "c2", label: "Capacitance C2", kind: "number", unit: "F" },
  ],
  outputs: [
    {
      id: "voltageAcrossC1V",
      label: "Voltage across C1",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const c1 = input.c1 as number;
    const c2 = input.c2 as number;
    if (!(c1 > 0))
      simpleError("c1", "C1 must be positive.", "invalid_capacitance");
    if (!(c2 > 0))
      simpleError("c2", "C2 must be positive.", "invalid_capacitance");
    return {
      voltageAcrossC1V: (input.supplyVolts as number) * (c2 / (c1 + c2)),
    };
  },
});
export const runSeriesCapacitorVoltage = seriesCapacitorVoltageTool.execute;
export default seriesCapacitorVoltageTool;
