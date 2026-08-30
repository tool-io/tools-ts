import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly anglesDegrees: readonly number[];
  readonly torquesNewtonMeters: readonly number[];
}>;
export type Output = Readonly<{
  readonly stickingPointAngleDegrees: number;
  readonly minimumTorqueNewtonMeters: number;
  readonly sampleIndex: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.anglesDegrees.length === 0 ||
    input.anglesDegrees.length !== input.torquesNewtonMeters.length
  )
    simpleError(
      "anglesDegrees",
      "Angle and torque arrays must be nonempty and equal length.",
      "length_mismatch",
    );
  let sampleIndex = 0;
  for (let index = 1; index < input.torquesNewtonMeters.length; index += 1)
    if (
      input.torquesNewtonMeters[index] < input.torquesNewtonMeters[sampleIndex]
    )
      sampleIndex = index;
  return {
    stickingPointAngleDegrees: input.anglesDegrees[sampleIndex],
    minimumTorqueNewtonMeters: input.torquesNewtonMeters[sampleIndex],
    sampleIndex,
  };
};

export const exampleInput = {
  anglesDegrees: [30, 60, 90],
  torquesNewtonMeters: [120, 95, 110],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  anglesDegrees: [20, 40],
  torquesNewtonMeters: [80, 90],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      anglesDegrees: input.anglesDegrees as readonly number[],
      torquesNewtonMeters: input.torquesNewtonMeters as readonly number[],
    }),
  description:
    "Locate the minimum measured torque and corresponding joint angle.",
  id: "kinesiology/torque-curve-sticking-point",
  inputs: [
    {
      id: "anglesDegrees",
      label: "Joint angles",
      kind: "numberList",
      unit: "°",
    },
    {
      id: "torquesNewtonMeters",
      label: "Measured torques",
      kind: "numberList",
      unit: "N·m",
    },
  ],
  outputs: [
    {
      id: "stickingPointAngleDegrees",
      label: "Sticking-point angle",
      kind: "number",
      unit: "°",
    },
    {
      id: "minimumTorqueNewtonMeters",
      label: "Minimum torque",
      kind: "number",
      unit: "N·m",
    },
    { id: "sampleIndex", label: "Sample index", kind: "integer", minimum: 0 },
  ],
  title: "Torque Curve Sticking Point",
});

export const run = tool.execute;
export default tool;
