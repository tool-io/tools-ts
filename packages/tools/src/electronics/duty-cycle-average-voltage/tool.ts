import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DutyCycleAverageVoltageInput = {
  readonly dutyPercent: number;
  readonly supplyVolts: number;
};

export type DutyCycleAverageVoltageOutput = {
  readonly averageVoltage: number;
};

export const dutyCycleAverageVoltageExample = {
  input: { dutyPercent: 50, supplyVolts: 12 },
  output: { averageVoltage: 6 },
} satisfies ToolExample<
  DutyCycleAverageVoltageInput,
  DutyCycleAverageVoltageOutput
>;

export const calculateDutyCycleAverageVoltage = (
  input: DutyCycleAverageVoltageInput,
): DutyCycleAverageVoltageOutput => ({
  averageVoltage: (input.supplyVolts * input.dutyPercent) / 100,
});

export const dutyCycleAverageVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateDutyCycleAverageVoltage(
      input as unknown as DutyCycleAverageVoltageInput,
    ),
  description: "Calculate the average voltage of a PWM signal.",
  id: "electronics/duty-cycle-average-voltage",
  inputs: [
    { id: "supplyVolts", kind: "number", label: "Supply voltage", unit: "V" },
    {
      id: "dutyPercent",
      kind: "number",
      label: "Duty cycle",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "averageVoltage",
      kind: "number",
      label: "Average voltage",
      unit: "V",
    },
  ],
  title: "PWM Average Voltage",
});
export const runDutyCycleAverageVoltage = dutyCycleAverageVoltageTool.execute;
export default dutyCycleAverageVoltageTool;
