import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatterySeriesVoltageInput = Readonly<{
  readonly cellVoltageVolts: number;
  readonly cellCount: number;
}>;
export type BatterySeriesVoltageOutput = Readonly<{
  readonly packVoltageVolts: number;
}>;

export const calculateBatterySeriesVoltage = (
  x: BatterySeriesVoltageInput,
): BatterySeriesVoltageOutput => {
  if (!Number.isFinite(x.cellVoltageVolts) || x.cellVoltageVolts < 0)
    simpleError("cellVoltageVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.cellCount) || x.cellCount < 1)
    simpleError("cellCount", "Provide a positive integer.");
  if (!Number.isInteger(x.cellCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const packVoltageVolts = x.cellVoltageVolts * x.cellCount;
  if (!Number.isFinite(packVoltageVolts))
    simpleError(
      "packVoltageVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    packVoltageVolts: Object.is(packVoltageVolts, -0) ? 0 : packVoltageVolts,
  };
};

export const example = {
  input: { cellVoltageVolts: 3.7, cellCount: 4 },
  output: { packVoltageVolts: 14.8 },
} satisfies ToolExample<BatterySeriesVoltageInput, BatterySeriesVoltageOutput>;

export const tool = createSimpleTool({
  id: "engineering/battery-series-voltage",
  title: "Battery Series Voltage",
  description:
    "Nominal series battery pack voltage from identical cell voltage and integer cell count.",
  inputs: [
    {
      id: "cellVoltageVolts",
      kind: "number",
      label: "Cell Voltage Volts",
      unit: "V",
      minimum: 0,
    },
    { id: "cellCount", kind: "integer", label: "Cell Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "packVoltageVolts",
      kind: "number",
      label: "Pack Voltage Volts",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateBatterySeriesVoltage({
      cellVoltageVolts: input.cellVoltageVolts as number,
      cellCount: input.cellCount as number,
    }),
});
export const batterySeriesVoltageTool = tool;
export const runBatterySeriesVoltage = tool.execute;
export default tool;
