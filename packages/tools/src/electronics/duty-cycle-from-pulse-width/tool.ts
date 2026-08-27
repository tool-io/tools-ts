import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DutyCycleFromPulseWidthInput = {
  readonly pulseWidthMs: number;
  readonly periodMs: number;
};

export type DutyCycleFromPulseWidthOutput = {
  readonly dutyCyclePercent: number;
};

export const dutyCycleFromPulseWidthExample = {
  input: { pulseWidthMs: 2, periodMs: 8 },
  output: { dutyCyclePercent: 25 },
} satisfies ToolExample<
  DutyCycleFromPulseWidthInput,
  DutyCycleFromPulseWidthOutput
>;

export const calculateDutyCycleFromPulseWidth = (
  input: DutyCycleFromPulseWidthInput,
): DutyCycleFromPulseWidthOutput => {
  if (!(input.periodMs > 0))
    simpleError("periodMs", "Period must be positive.", "invalid_period_ms");
  if (input.pulseWidthMs > input.periodMs)
    simpleError(
      "pulseWidthMs",
      "Pulse width cannot exceed the period.",
      "invalid_pulse",
    );
  return { dutyCyclePercent: (input.pulseWidthMs / input.periodMs) * 100 };
};

export const dutyCycleFromPulseWidthTool = createSimpleTool({
  calculate: (input) =>
    calculateDutyCycleFromPulseWidth(
      input as unknown as DutyCycleFromPulseWidthInput,
    ),
  description: "Compute the duty cycle percent as pulse width / period x 100.",
  id: "electronics/duty-cycle-from-pulse-width",
  inputs: [
    { id: "pulseWidthMs", kind: "number", label: "Pulse width", unit: "ms" },
    { id: "periodMs", kind: "number", label: "Period", unit: "ms" },
  ],
  outputs: [
    { id: "dutyCyclePercent", kind: "number", label: "Duty cycle", unit: "%" },
  ],
  title: "Duty From Pulse Width",
});
export const runDutyCycleFromPulseWidth = dutyCycleFromPulseWidthTool.execute;
export default dutyCycleFromPulseWidthTool;
