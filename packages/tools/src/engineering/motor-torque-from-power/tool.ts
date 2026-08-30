import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorTorqueFromPowerInput = Readonly<{
  readonly shaftPowerWatts: number;
  readonly speedRpm: number;
}>;
export type MotorTorqueFromPowerOutput = Readonly<{
  readonly torqueNewtonMeters: number;
}>;

export const calculateMotorTorqueFromPower = (
  x: MotorTorqueFromPowerInput,
): MotorTorqueFromPowerOutput => {
  if (!Number.isFinite(x.shaftPowerWatts) || x.shaftPowerWatts < 0)
    simpleError("shaftPowerWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedRpm) || x.speedRpm < 0)
    simpleError("speedRpm", "Provide a finite number at least 0.");
  const torqueNewtonMeters =
    (x.shaftPowerWatts * 60) / (2 * Math.PI * x.speedRpm);
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
  input: { shaftPowerWatts: 1000, speedRpm: 1000 },
  output: { torqueNewtonMeters: 9.549296585513721 },
} satisfies ToolExample<MotorTorqueFromPowerInput, MotorTorqueFromPowerOutput>;

export const tool = createSimpleTool({
  id: "engineering/motor-torque-from-power",
  title: "Motor Torque From Power",
  description:
    "Shaft torque from mechanical shaft power and rotational speed: T=P/(2πn/60).",
  inputs: [
    {
      id: "shaftPowerWatts",
      kind: "number",
      label: "Shaft Power Watts",
      unit: "W",
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
    calculateMotorTorqueFromPower({
      shaftPowerWatts: input.shaftPowerWatts as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const motorTorqueFromPowerTool = tool;
export const runMotorTorqueFromPower = tool.execute;
export default tool;
