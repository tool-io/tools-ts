import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelGaugeSocFromVoltageInput = Readonly<{
  readonly measuredVoltageV: number;
  readonly emptyVoltageV: number;
  readonly fullVoltageV: number;
}>;
export type FuelGaugeSocFromVoltageOutput = Readonly<{
  stateOfChargePercent: number;
}>;

export const calculateFuelGaugeSocFromVoltage = (
  i: FuelGaugeSocFromVoltageInput,
): FuelGaugeSocFromVoltageOutput => {
  if (
    i.fullVoltageV <= i.emptyVoltageV ||
    i.measuredVoltageV < i.emptyVoltageV ||
    i.measuredVoltageV > i.fullVoltageV
  )
    simpleError(
      "measuredVoltageV",
      "Voltages must define an increasing calibrated range containing the measurement.",
    );
  const value =
    (100 * (i.measuredVoltageV - i.emptyVoltageV)) /
    (i.fullVoltageV - i.emptyVoltageV);
  if (!Number.isFinite(value))
    simpleError(
      "stateOfChargePercent",
      "The inputs produce a non-finite result.",
    );
  return { stateOfChargePercent: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { measuredVoltageV: 3.8, emptyVoltageV: 3, fullVoltageV: 4.2 },
  output: { stateOfChargePercent: 66.66666666666664 },
} satisfies ToolExample<
  FuelGaugeSocFromVoltageInput,
  FuelGaugeSocFromVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/fuel-gauge-soc-from-voltage",
  title: "Fuel Gauge SOC From Voltage",
  description:
    "Estimate fuel-gauge state of charge by linear interpolation between user-supplied empty and full open-circuit voltages; chemistry, load, and temperature can make this inaccurate.",
  inputs: [
    {
      id: "measuredVoltageV",
      kind: "number",
      label: "Measured (V)",
      unit: "V",
    },
    { id: "emptyVoltageV", kind: "number", label: "Empty (V)", unit: "V" },
    { id: "fullVoltageV", kind: "number", label: "Full (V)", unit: "V" },
  ],
  outputs: [
    {
      id: "stateOfChargePercent",
      kind: "number",
      label: "State Of Charge (%)",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFuelGaugeSocFromVoltage({
      measuredVoltageV: input.measuredVoltageV as number,
      emptyVoltageV: input.emptyVoltageV as number,
      fullVoltageV: input.fullVoltageV as number,
    }),
});
export const fuelGaugeSocFromVoltageTool = tool;
export const runFuelGaugeSocFromVoltage = tool.execute;
export default tool;
