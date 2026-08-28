import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorElectricalPowerInput = {
  readonly currentAmps: number;
  readonly voltageVolts: number;
};

export type MotorElectricalPowerOutput = {
  readonly electricalPowerWatts: number;
};

export const motorElectricalPowerExample = {
  input: { currentAmps: 2.5, voltageVolts: 12 },
  output: { electricalPowerWatts: 30 },
} satisfies ToolExample<MotorElectricalPowerInput, MotorElectricalPowerOutput>;

export const calculateMotorElectricalPower = (
  input: MotorElectricalPowerInput,
): MotorElectricalPowerOutput => {
  if (!(input.voltageVolts >= 0))
    simpleError(
      "voltageVolts",
      "Voltage must not be negative.",
      "invalid_voltage",
    );
  if (!(input.currentAmps >= 0))
    simpleError(
      "currentAmps",
      "Current must not be negative.",
      "invalid_current",
    );
  return { electricalPowerWatts: input.voltageVolts * input.currentAmps };
};

export const motorElectricalPowerTool = createSimpleTool({
  calculate: (input) =>
    calculateMotorElectricalPower(
      input as unknown as MotorElectricalPowerInput,
    ),
  description:
    "Compute electrical input power in watts from supply voltage times current draw.",
  id: "electronics/motor-electrical-power",
  inputs: [
    {
      description: "Supply voltage across the motor.",
      id: "voltageVolts",
      kind: "number",
      label: "Voltage",
      unit: "V",
    },
    {
      description: "Current drawn by the motor.",
      id: "currentAmps",
      kind: "number",
      label: "Current",
      unit: "A",
    },
  ],
  outputs: [
    {
      description: "Electrical power delivered to the motor.",
      id: "electricalPowerWatts",
      kind: "number",
      label: "Electrical power",
      unit: "W",
    },
  ],
  title: "Electrical Power In",
});
export const runMotorElectricalPower = motorElectricalPowerTool.execute;
export default motorElectricalPowerTool;
