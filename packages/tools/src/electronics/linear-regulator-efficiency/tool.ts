import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LinearRegulatorEfficiencyInput = {
  readonly inputVolts: number;
  readonly outputVolts: number;
};

export type LinearRegulatorEfficiencyOutput = {
  readonly efficiencyPercent: number;
};

export const linearRegulatorEfficiencyExample = {
  input: { inputVolts: 12, outputVolts: 5 },
  output: { efficiencyPercent: 41.66666666666667 },
} satisfies ToolExample<
  LinearRegulatorEfficiencyInput,
  LinearRegulatorEfficiencyOutput
>;

export const calculateLinearRegulatorEfficiency = (
  input: LinearRegulatorEfficiencyInput,
): LinearRegulatorEfficiencyOutput => {
  if (!(input.inputVolts > 0))
    simpleError(
      "inputVolts",
      "Input voltage must be positive.",
      "invalid_input_volts",
    );
  if (input.outputVolts > input.inputVolts)
    simpleError(
      "outputVolts",
      "Output voltage cannot exceed input voltage.",
      "invalid_output_volts",
    );
  return { efficiencyPercent: (input.outputVolts / input.inputVolts) * 100 };
};

export const linearRegulatorEfficiencyTool = createSimpleTool({
  calculate: (input) =>
    calculateLinearRegulatorEfficiency(
      input as unknown as LinearRegulatorEfficiencyInput,
    ),
  description: "Calculate linear regulator efficiency.",
  id: "electronics/linear-regulator-efficiency",
  inputs: [
    { id: "inputVolts", kind: "number", label: "Input voltage", unit: "V" },
    { id: "outputVolts", kind: "number", label: "Output voltage", unit: "V" },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency",
      unit: "%",
    },
  ],
  title: "LDO Efficiency",
});
export const runLinearRegulatorEfficiency =
  linearRegulatorEfficiencyTool.execute;
export default linearRegulatorEfficiencyTool;
