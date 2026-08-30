import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, wrap, signedAngle } from "../shared.js";

export type Input = Readonly<{
  readonly argumentPeriapsisDegrees: number;
  readonly toleranceDegrees: number;
}>;
export type Output = Readonly<{
  readonly nearestTargetDegrees: number;
  readonly angleSeparationDegrees: number;
  readonly angleConditionMet: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.toleranceDegrees, "toleranceDegrees");
  const a = wrap(input.argumentPeriapsisDegrees),
    d90 = Math.abs(signedAngle(a - 90)),
    d270 = Math.abs(signedAngle(a - 270)),
    nearestTargetDegrees = d90 <= d270 ? 90 : 270,
    angleSeparationDegrees = Math.min(d90, d270);
  return {
    nearestTargetDegrees,
    angleSeparationDegrees,
    angleConditionMet: angleSeparationDegrees <= input.toleranceDegrees,
  };
};
export const exampleInput = {
  argumentPeriapsisDegrees: 450,
  toleranceDegrees: 1,
} satisfies Input;
export const exampleOutput = {
  nearestTargetDegrees: 90,
  angleSeparationDegrees: 0,
  angleConditionMet: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/frozen-periapsis-angle-screen",
  title: "Frozen Periapsis Angle Screen",
  description:
    "Screen the 90/270-degree periapsis orientation necessary in common frozen-orbit models; this alone does not establish a frozen orbit.",
  inputs: [
    {
      id: "argumentPeriapsisDegrees",
      label: "Argument periapsis degrees",
      kind: "number",
    },
    { id: "toleranceDegrees", label: "Tolerance degrees", kind: "number" },
  ],
  outputs: [
    {
      id: "nearestTargetDegrees",
      label: "Nearest target degrees",
      kind: "number",
    },
    {
      id: "angleSeparationDegrees",
      label: "Angle separation degrees",
      kind: "number",
    },
    { id: "angleConditionMet", label: "Angle condition met", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      argumentPeriapsisDegrees: value.argumentPeriapsisDegrees as number,
      toleranceDegrees: value.toleranceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
