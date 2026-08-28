import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PulseWidthFromDutyCycleInput = {
  readonly dutyPercent: number;
  readonly periodMs: number;
};

export type PulseWidthFromDutyCycleOutput = {
  readonly pulseWidthMs: number;
};

export const pulseWidthFromDutyCycleExample = {
  input: { dutyPercent: 25, periodMs: 8 },
  output: { pulseWidthMs: 2 },
} satisfies ToolExample<
  PulseWidthFromDutyCycleInput,
  PulseWidthFromDutyCycleOutput
>;

export const calculatePulseWidthFromDutyCycle = (
  input: PulseWidthFromDutyCycleInput,
): PulseWidthFromDutyCycleOutput => {
  if (!(input.periodMs > 0))
    simpleError("periodMs", "Period must be positive.", "invalid_period_ms");
  return { pulseWidthMs: (input.dutyPercent * input.periodMs) / 100 };
};

export const pulseWidthFromDutyCycleTool = createSimpleTool({
  calculate: (input) =>
    calculatePulseWidthFromDutyCycle(
      input as unknown as PulseWidthFromDutyCycleInput,
    ),
  description:
    "Compute the pulse width as duty percent x period / 100 for duty between zero and one hundred inclusive.",
  id: "electronics/pulse-width-from-duty-cycle",
  inputs: [
    {
      id: "dutyPercent",
      kind: "number",
      label: "Duty cycle",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    { id: "periodMs", kind: "number", label: "Period", unit: "ms" },
  ],
  outputs: [
    { id: "pulseWidthMs", kind: "number", label: "Pulse width", unit: "ms" },
  ],
  title: "Pulse Width From Duty",
});
export const runPulseWidthFromDutyCycle = pulseWidthFromDutyCycleTool.execute;
export default pulseWidthFromDutyCycleTool;
