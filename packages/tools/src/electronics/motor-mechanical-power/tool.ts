import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorMechanicalPowerInput = {
  readonly angularSpeedRadS: number;
  readonly torqueNm: number;
};

export type MotorMechanicalPowerOutput = {
  readonly mechanicalPowerWatts: number;
};

export const motorMechanicalPowerExample = {
  input: { angularSpeedRadS: 100, torqueNm: 0.5 },
  output: { mechanicalPowerWatts: 50 },
} satisfies ToolExample<MotorMechanicalPowerInput, MotorMechanicalPowerOutput>;

export const calculateMotorMechanicalPower = (
  input: MotorMechanicalPowerInput,
): MotorMechanicalPowerOutput => {
  if (!(input.torqueNm >= 0))
    simpleError("torqueNm", "Torque must not be negative.", "invalid_torque");
  if (!(input.angularSpeedRadS > 0))
    simpleError(
      "angularSpeedRadS",
      "Angular speed must be positive.",
      "invalid_speed",
    );
  return {
    mechanicalPowerWatts: input.torqueNm * input.angularSpeedRadS,
  };
};

export const motorMechanicalPowerTool = createSimpleTool({
  calculate: (input) =>
    calculateMotorMechanicalPower(
      input as unknown as MotorMechanicalPowerInput,
    ),
  description:
    "Compute mechanical output power in watts from torque in newton meters times angular speed in radians per second.",
  id: "electronics/motor-mechanical-power",
  inputs: [
    {
      description: "Shaft torque.",
      id: "torqueNm",
      kind: "number",
      label: "Torque",
      unit: "N·m",
    },
    {
      description: "Angular speed of the shaft.",
      id: "angularSpeedRadS",
      kind: "number",
      label: "Angular speed",
      unit: "rad/s",
    },
  ],
  outputs: [
    {
      description: "Mechanical power delivered at the shaft.",
      id: "mechanicalPowerWatts",
      kind: "number",
      label: "Mechanical power",
      unit: "W",
    },
  ],
  title: "Mechanical Power",
});
export const runMotorMechanicalPower = motorMechanicalPowerTool.execute;
export default motorMechanicalPowerTool;
