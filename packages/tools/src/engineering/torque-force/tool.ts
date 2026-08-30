import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TorqueForceInput = Readonly<{
  readonly forceNewtons: number;
  readonly armMeters: number;
  readonly angleDegrees: number;
}>;
export type TorqueForceOutput = Readonly<{
  readonly torqueNewtonMeters: number;
}>;

export const calculateTorqueForce = (
  x: TorqueForceInput,
): TorqueForceOutput => {
  if (!Number.isFinite(x.forceNewtons) || x.forceNewtons < 0)
    simpleError("forceNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.armMeters) || x.armMeters < 0)
    simpleError("armMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.angleDegrees) || x.angleDegrees < 0)
    simpleError("angleDegrees", "Provide a finite number at least 0.");
  if (x.angleDegrees > 180)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const torqueNewtonMeters =
    x.forceNewtons * x.armMeters * Math.sin((x.angleDegrees * Math.PI) / 180);
  if (!Number.isFinite(torqueNewtonMeters))
    simpleError(
      "torqueNewtonMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    torqueNewtonMeters: Object.is(torqueNewtonMeters, -0)
      ? 0
      : torqueNewtonMeters,
  };
};

export const example = {
  input: { forceNewtons: 100, armMeters: 0.5, angleDegrees: 90 },
  output: { torqueNewtonMeters: 50 },
} satisfies ToolExample<TorqueForceInput, TorqueForceOutput>;

export const tool = createSimpleTool({
  id: "engineering/torque-force",
  title: "Torque Force",
  description:
    "Torque magnitude from force, lever-arm length and angle between force and lever arm.",
  inputs: [
    {
      id: "forceNewtons",
      kind: "number",
      label: "Force Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "armMeters",
      kind: "number",
      label: "Arm Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "angleDegrees",
      kind: "number",
      label: "Angle Degrees",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "torqueNewtonMeters",
      kind: "number",
      label: "Torque Newton Meters",
      unit: "N·m",
    },
  ],
  calculate: (input) =>
    calculateTorqueForce({
      forceNewtons: input.forceNewtons as number,
      armMeters: input.armMeters as number,
      angleDegrees: input.angleDegrees as number,
    }),
});
export const torqueForceTool = tool;
export const runTorqueForce = tool.execute;
export default tool;
