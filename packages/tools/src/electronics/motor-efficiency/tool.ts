import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorEfficiencyInput = {
  readonly electricalWatts: number;
  readonly mechanicalWatts: number;
};

export type MotorEfficiencyOutput = {
  readonly efficiencyPercent: number;
};

export const motorEfficiencyExample = {
  input: { electricalWatts: 100, mechanicalWatts: 75 },
  output: { efficiencyPercent: 75 },
} satisfies ToolExample<MotorEfficiencyInput, MotorEfficiencyOutput>;

export const calculateMotorEfficiency = (
  input: MotorEfficiencyInput,
): MotorEfficiencyOutput => {
  if (!(input.electricalWatts > 0))
    simpleError(
      "electricalWatts",
      "Electrical input power must be positive.",
      "invalid_powers",
    );
  if (!(input.mechanicalWatts <= input.electricalWatts))
    simpleError(
      "mechanicalWatts",
      "Mechanical output power must not exceed electrical input power.",
      "invalid_powers",
    );
  return {
    efficiencyPercent: (input.mechanicalWatts / input.electricalWatts) * 100,
  };
};

export const motorEfficiencyTool = createSimpleTool({
  calculate: (input) =>
    calculateMotorEfficiency(input as unknown as MotorEfficiencyInput),
  description:
    "Compute motor efficiency percent as mechanical output power over electrical input power times one hundred.",
  id: "electronics/motor-efficiency",
  inputs: [
    {
      description: "Mechanical output power at the shaft.",
      id: "mechanicalWatts",
      kind: "number",
      label: "Mechanical power",
      unit: "W",
    },
    {
      description: "Electrical input power to the motor.",
      id: "electricalWatts",
      kind: "number",
      label: "Electrical power",
      unit: "W",
    },
  ],
  outputs: [
    {
      description: "Conversion efficiency of the motor.",
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency",
      unit: "%",
    },
  ],
  title: "Motor Efficiency %",
});
export const runMotorEfficiency = motorEfficiencyTool.execute;
export default motorEfficiencyTool;
