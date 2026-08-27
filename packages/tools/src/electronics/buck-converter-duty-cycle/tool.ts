import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BuckConverterDutyCycleInput = {
  readonly inputVolts: number;
  readonly outputVolts: number;
};

export type BuckConverterDutyCycleOutput = {
  readonly dutyCyclePercent: number;
};

export const buckConverterDutyCycleExample = {
  input: { inputVolts: 12, outputVolts: 5 },
  output: { dutyCyclePercent: 41.66666666666667 },
} satisfies ToolExample<
  BuckConverterDutyCycleInput,
  BuckConverterDutyCycleOutput
>;

export const calculateBuckConverterDutyCycle = (
  input: BuckConverterDutyCycleInput,
): BuckConverterDutyCycleOutput => {
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
  return { dutyCyclePercent: (input.outputVolts / input.inputVolts) * 100 };
};

export const buckConverterDutyCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateBuckConverterDutyCycle(
      input as unknown as BuckConverterDutyCycleInput,
    ),
  description: "Calculate ideal buck converter duty cycle.",
  id: "electronics/buck-converter-duty-cycle",
  inputs: [
    { id: "inputVolts", kind: "number", label: "Input voltage", unit: "V" },
    { id: "outputVolts", kind: "number", label: "Output voltage", unit: "V" },
  ],
  outputs: [
    { id: "dutyCyclePercent", kind: "number", label: "Duty cycle", unit: "%" },
  ],
  title: "Buck Duty Cycle",
});
export const runBuckConverterDutyCycle = buckConverterDutyCycleTool.execute;
export default buckConverterDutyCycleTool;
