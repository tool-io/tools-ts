import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VoltageDividerInput = {
  readonly inputVoltageV: number;
  readonly r1Ohms: number;
  readonly r2Ohms: number;
};

export type VoltageDividerOutput = {
  readonly outputVoltageV: number;
};

export const voltageDividerExample = {
  input: {
    inputVoltageV: 12,
    r1Ohms: 1000,
    r2Ohms: 2000,
  },
  output: { outputVoltageV: 8 },
} satisfies ToolExample<VoltageDividerInput, VoltageDividerOutput>;

export const calculateVoltageDivider = (
  input: VoltageDividerInput,
): VoltageDividerOutput => {
  if (input.r1Ohms <= 0 || input.r2Ohms <= 0)
    simpleError(
      "r1Ohms",
      "Both divider resistances must be positive.",
      "invalid_input",
    );
  return {
    outputVoltageV:
      input.inputVoltageV * (input.r2Ohms / (input.r1Ohms + input.r2Ohms)),
  };
};

export const voltageDividerTool = createSimpleTool({
  calculate: (input) =>
    calculateVoltageDivider(input as unknown as VoltageDividerInput),
  description:
    "Compute the divided output voltage across R2 of a two-resistor series divider: Vout = Vin * R2 / (R1 + R2).",
  id: "electronics/voltage-divider",
  inputs: [
    {
      description: "Supply voltage applied across the divider.",
      id: "inputVoltageV",
      kind: "number",
      label: "Input voltage",
      unit: "V",
    },
    {
      description: "Resistance from the top of the divider to the tap point.",
      id: "r1Ohms",
      kind: "number",
      label: "R1",
      unit: "Ω",
    },
    {
      description: "Resistance from the tap point to ground.",
      id: "r2Ohms",
      kind: "number",
      label: "R2",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Voltage available at the tap point across R2.",
      id: "outputVoltageV",
      kind: "number",
      label: "Output voltage",
      unit: "V",
    },
  ],
  title: "Voltage Divider Calculator",
});
export const runVoltageDivider = voltageDividerTool.execute;
export default voltageDividerTool;
