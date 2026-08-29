import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorLockedRotorTorqueInput = Readonly<{
  readonly torqueConstantNmPerAmpere: number;
  readonly lockedRotorCurrentAmperes: number;
}>;
export type MotorLockedRotorTorqueOutput = Readonly<{
  lockedRotorTorqueNm: number;
}>;

export const calculateMotorLockedRotorTorque = (
  i: MotorLockedRotorTorqueInput,
): MotorLockedRotorTorqueOutput => {
  const value = i.torqueConstantNmPerAmpere * i.lockedRotorCurrentAmperes;
  if (!Number.isFinite(value))
    simpleError(
      "lockedRotorTorqueNm",
      "The inputs produce a non-finite result.",
    );
  return { lockedRotorTorqueNm: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { torqueConstantNmPerAmpere: 0.08, lockedRotorCurrentAmperes: 20 },
  output: { lockedRotorTorqueNm: 1.6 },
} satisfies ToolExample<
  MotorLockedRotorTorqueInput,
  MotorLockedRotorTorqueOutput
>;

export const tool = createSimpleTool({
  id: "electronics/motor-locked-rotor-torque",
  title: "Motor Locked Rotor Torque",
  description:
    "Estimate locked-rotor torque of a DC motor from its torque constant and measured or modeled locked-rotor current.",
  inputs: [
    {
      id: "torqueConstantNmPerAmpere",
      kind: "number",
      label: "Torque Constant (N·m/A)",
      unit: "N·m/A",
      minimum: 0,
    },
    {
      id: "lockedRotorCurrentAmperes",
      kind: "number",
      label: "Locked Rotor Current (A)",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "lockedRotorTorqueNm",
      kind: "number",
      label: "Locked Rotor Torque (N·m)",
      unit: "N·m",
    },
  ],
  calculate: (input) =>
    calculateMotorLockedRotorTorque({
      torqueConstantNmPerAmpere: input.torqueConstantNmPerAmpere as number,
      lockedRotorCurrentAmperes: input.lockedRotorCurrentAmperes as number,
    }),
});
export const motorLockedRotorTorqueTool = tool;
export const runMotorLockedRotorTorque = tool.execute;
export default tool;
