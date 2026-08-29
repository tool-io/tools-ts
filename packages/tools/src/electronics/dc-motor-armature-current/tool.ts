import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DcMotorArmatureCurrentInput = Readonly<{
  readonly appliedVoltageV: number;
  readonly backEmfV: number;
  readonly armatureResistanceOhms: number;
}>;
export type DcMotorArmatureCurrentOutput = Readonly<{
  armatureCurrentAmperes: number;
}>;

export const calculateDcMotorArmatureCurrent = (
  i: DcMotorArmatureCurrentInput,
): DcMotorArmatureCurrentOutput => {
  const value = (i.appliedVoltageV - i.backEmfV) / i.armatureResistanceOhms;
  if (!Number.isFinite(value))
    simpleError(
      "armatureCurrentAmperes",
      "The inputs produce a non-finite result.",
    );
  return { armatureCurrentAmperes: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { appliedVoltageV: 24, backEmfV: 18, armatureResistanceOhms: 1.5 },
  output: { armatureCurrentAmperes: 4 },
} satisfies ToolExample<
  DcMotorArmatureCurrentInput,
  DcMotorArmatureCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/dc-motor-armature-current",
  title: "Dc Motor Armature Current",
  description:
    "Calculate DC motor armature current from applied voltage, back EMF, and winding resistance using the steady-state armature equation.",
  inputs: [
    { id: "appliedVoltageV", kind: "number", label: "Applied (V)", unit: "V" },
    { id: "backEmfV", kind: "number", label: "Back Emf (V)", unit: "V" },
    {
      id: "armatureResistanceOhms",
      kind: "number",
      label: "Armature Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "armatureCurrentAmperes",
      kind: "number",
      label: "Armature Current (A)",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateDcMotorArmatureCurrent({
      appliedVoltageV: input.appliedVoltageV as number,
      backEmfV: input.backEmfV as number,
      armatureResistanceOhms: input.armatureResistanceOhms as number,
    }),
});
export const dcMotorArmatureCurrentTool = tool;
export const runDcMotorArmatureCurrent = tool.execute;
export default tool;
