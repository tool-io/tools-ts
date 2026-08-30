import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HapticActuatorForceInput = Readonly<{
  readonly movingMassKg: number;
  readonly accelerationMPerS2: number;
}>;
export type HapticActuatorForceOutput = Readonly<{
  readonly inertialForceN: number;
}>;

export const calculateHapticActuatorForce = (
  x: HapticActuatorForceInput,
): HapticActuatorForceOutput => {
  if (!Number.isFinite(x.movingMassKg) || x.movingMassKg < 0)
    simpleError("movingMassKg", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.accelerationMPerS2) || x.accelerationMPerS2 < 0)
    simpleError("accelerationMPerS2", "Provide a finite number at least 0.");
  const inertialForceN = x.movingMassKg * x.accelerationMPerS2;
  if (!Number.isFinite(inertialForceN))
    simpleError("inertialForceN", "The inputs produce an invalid result.");
  return { inertialForceN: Object.is(inertialForceN, -0) ? 0 : inertialForceN };
};

export const example = {
  input: { movingMassKg: 0.01, accelerationMPerS2: 10 },
  output: { inertialForceN: 0.1 },
} satisfies ToolExample<HapticActuatorForceInput, HapticActuatorForceOutput>;

export const tool = createSimpleTool({
  id: "electronics/haptic-actuator-force",
  title: "Haptic Actuator Force",
  description:
    "Estimate an actuator proof mass's inertial force magnitude from effective moving mass and acceleration magnitude.",
  inputs: [
    {
      id: "movingMassKg",
      kind: "number",
      label: "Effective moving mass",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "accelerationMPerS2",
      kind: "number",
      label: "Acceleration magnitude",
      unit: "m/s²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "inertialForceN",
      kind: "number",
      label: "Inertial force magnitude",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateHapticActuatorForce({
      movingMassKg: input.movingMassKg as number,
      accelerationMPerS2: input.accelerationMPerS2 as number,
    }),
});
export const hapticActuatorForceTool = tool;
export const runHapticActuatorForce = tool.execute;
export default tool;
