import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThirdWheelSpeedInput = Readonly<{
  readonly drivingRpm: number;
  readonly drivingTeeth: number;
  readonly drivenTeeth: number;
}>;
export type ThirdWheelSpeedOutput = Readonly<{
  readonly drivenRpm: number;
}>;

export const calculateThirdWheelSpeed = (
  x: ThirdWheelSpeedInput,
): ThirdWheelSpeedOutput => {
  if (!Number.isFinite(x.drivingRpm) || x.drivingRpm < 0)
    simpleError("drivingRpm", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.drivingTeeth) ||
    !Number.isSafeInteger(x.drivingTeeth) ||
    x.drivingTeeth < 1
  )
    simpleError("drivingTeeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.drivenTeeth) ||
    !Number.isSafeInteger(x.drivenTeeth) ||
    x.drivenTeeth < 1
  )
    simpleError("drivenTeeth", "Provide a positive safe integer.");
  const drivenRpm = (x.drivingRpm * x.drivingTeeth) / x.drivenTeeth;
  if (!Number.isFinite(drivenRpm))
    simpleError(
      "drivenRpm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { drivenRpm: Object.is(drivenRpm, -0) ? 0 : drivenRpm };
};

export const example = {
  input: {
    drivingRpm: 1,
    drivingTeeth: 60,
    drivenTeeth: 15,
  },
  output: { drivenRpm: 4 },
} satisfies ToolExample<ThirdWheelSpeedInput, ThirdWheelSpeedOutput>;

export const tool = createSimpleTool({
  id: "horology/third-wheel-speed",
  title: "Third Wheel Speed",
  description:
    "Driven wheel revolutions per minute from driving wheel speed and mating tooth counts.",
  inputs: [
    {
      id: "drivingRpm",
      kind: "number",
      label: "Driving Rpm",
      unit: "rpm",
      minimum: 0,
    },
    { id: "drivingTeeth", kind: "integer", label: "Driving Teeth", minimum: 1 },
    { id: "drivenTeeth", kind: "integer", label: "Driven Teeth", minimum: 1 },
  ],
  outputs: [
    { id: "drivenRpm", kind: "number", label: "Driven Rpm", unit: "rpm" },
  ],
  calculate: (input) =>
    calculateThirdWheelSpeed({
      drivingRpm: input.drivingRpm as number,
      drivingTeeth: input.drivingTeeth as number,
      drivenTeeth: input.drivenTeeth as number,
    }),
});
export const thirdWheelSpeedTool = tool;
export const runThirdWheelSpeed = tool.execute;
export default tool;
