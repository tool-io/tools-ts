import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LinearRegulatorDropoutVoltageInput = {
  readonly dropoutVolts: number;
  readonly inputVolts: number;
  readonly outputVolts: number;
};

export type LinearRegulatorDropoutVoltageOutput = {
  readonly dropoutHeadroomV: number;
};

export const linearRegulatorDropoutVoltageExample = {
  input: { dropoutVolts: 1.2, inputVolts: 12, outputVolts: 5 },
  output: { dropoutHeadroomV: 5.8 },
} satisfies ToolExample<
  LinearRegulatorDropoutVoltageInput,
  LinearRegulatorDropoutVoltageOutput
>;

export const calculateLinearRegulatorDropoutVoltage = (
  input: LinearRegulatorDropoutVoltageInput,
): LinearRegulatorDropoutVoltageOutput => {
  if (!(input.inputVolts > 0))
    simpleError(
      "inputVolts",
      "Input voltage must be positive.",
      "invalid_voltage",
    );
  if (!(input.outputVolts > 0))
    simpleError(
      "outputVolts",
      "Output voltage must be positive.",
      "invalid_voltage",
    );
  if (!(input.dropoutVolts > 0))
    simpleError(
      "dropoutVolts",
      "Dropout voltage must be positive.",
      "invalid_dropout",
    );
  return {
    dropoutHeadroomV:
      input.inputVolts - (input.outputVolts + input.dropoutVolts),
  };
};

export const linearRegulatorDropoutVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateLinearRegulatorDropoutVoltage(
      input as unknown as LinearRegulatorDropoutVoltageInput,
    ),
  description:
    "Compute LDO dropout headroom as input minus the sum of output and dropout voltages; negative values indicate insufficient headroom.",
  id: "electronics/linear-regulator-dropout-voltage",
  inputs: [
    { id: "dropoutVolts", kind: "number", label: "Dropout voltage", unit: "V" },
    { id: "inputVolts", kind: "number", label: "Input voltage", unit: "V" },
    { id: "outputVolts", kind: "number", label: "Output voltage", unit: "V" },
  ],
  outputs: [
    {
      id: "dropoutHeadroomV",
      kind: "number",
      label: "Dropout headroom",
      unit: "V",
    },
  ],
  title: "LDO Dropout Headroom",
});
export const runLinearRegulatorDropoutVoltage =
  linearRegulatorDropoutVoltageTool.execute;
export default linearRegulatorDropoutVoltageTool;
