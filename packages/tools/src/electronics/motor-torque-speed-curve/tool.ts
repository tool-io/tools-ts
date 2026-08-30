import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorTorqueSpeedCurveInput = Readonly<{
  readonly stallTorqueNewtonMeters: number;
  readonly noLoadSpeedRpm: number;
  readonly speedRpm: number;
}>;
export type MotorTorqueSpeedCurveOutput = Readonly<{
  readonly torqueNewtonMeters: number;
}>;

export const calculateMotorTorqueSpeedCurve = (
  x: MotorTorqueSpeedCurveInput,
): MotorTorqueSpeedCurveOutput => {
  if (
    !Number.isFinite(x.stallTorqueNewtonMeters) ||
    x.stallTorqueNewtonMeters < 0
  )
    simpleError(
      "stallTorqueNewtonMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.noLoadSpeedRpm) || x.noLoadSpeedRpm < 0)
    simpleError("noLoadSpeedRpm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedRpm) || x.speedRpm < 0)
    simpleError("speedRpm", "Provide a finite number at least 0.");
  if (x.speedRpm > x.noLoadSpeedRpm)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const torqueNewtonMeters =
    x.stallTorqueNewtonMeters * (1 - x.speedRpm / x.noLoadSpeedRpm);
  if (!Number.isFinite(torqueNewtonMeters))
    simpleError(
      "torqueNewtonMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    torqueNewtonMeters: Object.is(torqueNewtonMeters, -0)
      ? 0
      : torqueNewtonMeters,
  };
};

export const example = {
  input: { stallTorqueNewtonMeters: 2, noLoadSpeedRpm: 1000, speedRpm: 500 },
  output: { torqueNewtonMeters: 1 },
} satisfies ToolExample<
  MotorTorqueSpeedCurveInput,
  MotorTorqueSpeedCurveOutput
>;

export const tool = createSimpleTool({
  id: "electronics/motor-torque-speed-curve",
  title: "Motor Torque Speed Curve",
  description:
    "Linear permanent-magnet DC motor torque at a specified speed using stall torque and ideal no-load speed.",
  inputs: [
    {
      id: "stallTorqueNewtonMeters",
      kind: "number",
      label: "Stall Torque Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
    {
      id: "noLoadSpeedRpm",
      kind: "number",
      label: "No Load Speed Rpm",
      unit: "rpm",
      minimum: 0,
    },
    {
      id: "speedRpm",
      kind: "number",
      label: "Speed Rpm",
      unit: "rpm",
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
    calculateMotorTorqueSpeedCurve({
      stallTorqueNewtonMeters: input.stallTorqueNewtonMeters as number,
      noLoadSpeedRpm: input.noLoadSpeedRpm as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const motorTorqueSpeedCurveTool = tool;
export const runMotorTorqueSpeedCurve = tool.execute;
export default tool;
