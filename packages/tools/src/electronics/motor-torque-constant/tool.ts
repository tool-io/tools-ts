import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorTorqueConstantInput = {
  readonly kvRpmPerVolt: number;
};

export type MotorTorqueConstantOutput = {
  readonly torqueConstantNmPerA: number;
};

export const motorTorqueConstantExample = {
  input: { kvRpmPerVolt: 1000 },
  output: { torqueConstantNmPerA: 0.009549296585513721 },
} satisfies ToolExample<MotorTorqueConstantInput, MotorTorqueConstantOutput>;

export const calculateMotorTorqueConstant = (
  input: MotorTorqueConstantInput,
): MotorTorqueConstantOutput => {
  if (!(input.kvRpmPerVolt > 0))
    simpleError("kvRpmPerVolt", "Kv must be positive.", "invalid_kv");
  return { torqueConstantNmPerA: 60 / (2 * Math.PI * input.kvRpmPerVolt) };
};

export const motorTorqueConstantTool = createSimpleTool({
  calculate: (input) =>
    calculateMotorTorqueConstant(input as unknown as MotorTorqueConstantInput),
  description:
    "Compute the torque constant Kt in newton meters per ampere from the motor velocity constant Kv using Kt = 60 / (2 * pi * Kv).",
  id: "electronics/motor-torque-constant",
  inputs: [
    {
      description: "Motor velocity constant in rpm per volt.",
      id: "kvRpmPerVolt",
      kind: "number",
      label: "Kv",
      unit: "rpm/V",
    },
  ],
  outputs: [
    {
      description: "Torque produced per ampere of current.",
      id: "torqueConstantNmPerA",
      kind: "number",
      label: "Torque constant Kt",
      unit: "N·m/A",
    },
  ],
  title: "Torque Constant Kt",
});
export const runMotorTorqueConstant = motorTorqueConstantTool.execute;
export default motorTorqueConstantTool;
