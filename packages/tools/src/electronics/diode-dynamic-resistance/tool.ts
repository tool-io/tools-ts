import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiodeDynamicResistanceInput = {
  readonly diodeCurrentA: number;
  readonly nIdeality?: number;
  readonly thermalVoltageVolts: number;
};

export type DiodeDynamicResistanceOutput = {
  readonly dynamicResistanceOhms: number;
};

export const diodeDynamicResistanceExample = {
  input: { diodeCurrentA: 0.001, thermalVoltageVolts: 0.025852 },
  output: { dynamicResistanceOhms: 25.852 },
} satisfies ToolExample<
  DiodeDynamicResistanceInput,
  DiodeDynamicResistanceOutput
>;

export const calculateDiodeDynamicResistance = (
  input: DiodeDynamicResistanceInput,
): DiodeDynamicResistanceOutput => {
  if (!(input.thermalVoltageVolts > 0))
    simpleError(
      "thermalVoltageVolts",
      "Thermal voltage must be positive.",
      "invalid_thermal_voltage",
    );
  if (!(input.diodeCurrentA > 0))
    simpleError(
      "diodeCurrentA",
      "Diode current must be positive.",
      "invalid_current",
    );
  return {
    dynamicResistanceOhms:
      ((input.nIdeality ?? 1) * input.thermalVoltageVolts) /
      input.diodeCurrentA,
  };
};

export const diodeDynamicResistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateDiodeDynamicResistance(
      input as unknown as DiodeDynamicResistanceInput,
    ),
  description: "Calculate diode small-signal dynamic resistance.",
  id: "electronics/diode-dynamic-resistance",
  inputs: [
    {
      id: "thermalVoltageVolts",
      kind: "number",
      label: "Thermal voltage",
      unit: "V",
    },
    { id: "diodeCurrentA", kind: "number", label: "Diode current", unit: "A" },
    {
      default: 1,
      id: "nIdeality",
      kind: "number",
      label: "Ideality factor",
    },
  ],
  outputs: [
    {
      id: "dynamicResistanceOhms",
      kind: "number",
      label: "Dynamic resistance",
      unit: "ohm",
    },
  ],
  title: "Diode Dynamic Resistance",
});
export const runDiodeDynamicResistance = diodeDynamicResistanceTool.execute;
export default diodeDynamicResistanceTool;
