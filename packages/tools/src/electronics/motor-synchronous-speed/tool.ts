import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorSynchronousSpeedInput = Readonly<{
  readonly frequencyHz: number;
  readonly poleCount: number;
}>;
export type MotorSynchronousSpeedOutput = Readonly<{
  synchronousSpeedRpm: number;
}>;

export const calculateMotorSynchronousSpeed = (
  i: MotorSynchronousSpeedInput,
): MotorSynchronousSpeedOutput => {
  if (!Number.isSafeInteger(i.poleCount) || i.poleCount % 2 !== 0)
    simpleError("poleCount", "Pole count must be a positive even integer.");
  const value = (120 * i.frequencyHz) / i.poleCount;
  if (!Number.isFinite(value))
    simpleError(
      "synchronousSpeedRpm",
      "The inputs produce a non-finite result.",
    );
  return { synchronousSpeedRpm: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { frequencyHz: 50, poleCount: 4 },
  output: { synchronousSpeedRpm: 1500 },
} satisfies ToolExample<
  MotorSynchronousSpeedInput,
  MotorSynchronousSpeedOutput
>;

export const tool = createSimpleTool({
  id: "electronics/motor-synchronous-speed",
  title: "Motor Synchronous Speed",
  description:
    "Calculate AC motor synchronous speed in RPM from electrical frequency and an even number of magnetic poles, using 120f/P.",
  inputs: [
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      unit: "Hz",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "poleCount",
      kind: "integer",
      label: "Pole Count",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "synchronousSpeedRpm",
      kind: "number",
      label: "Synchronous Speed (rpm)",
      unit: "rpm",
    },
  ],
  calculate: (input) =>
    calculateMotorSynchronousSpeed({
      frequencyHz: input.frequencyHz as number,
      poleCount: input.poleCount as number,
    }),
});
export const motorSynchronousSpeedTool = tool;
export const runMotorSynchronousSpeed = tool.execute;
export default tool;
