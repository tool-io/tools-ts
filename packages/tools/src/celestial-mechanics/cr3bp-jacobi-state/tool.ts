import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, fraction, vector, dot } from "../shared.js";

export type Input = Readonly<{
  readonly position: readonly number[];
  readonly rotatingVelocity: readonly number[];
  readonly massFraction: number;
  readonly referenceJacobi: number;
  readonly absoluteTolerance: number;
}>;
export type Output = Readonly<{
  readonly jacobiValue: number;
  readonly absoluteDrift: number;
  readonly withinTolerance: boolean;
}>;
export const calculate = (input: Input): Output => {
  vector(input.position, "position");
  vector(input.rotatingVelocity, "rotatingVelocity");
  fraction(input.massFraction, "massFraction");
  if (input.massFraction <= 0 || input.massFraction > 0.5)
    simpleError(
      "massFraction",
      "Smaller-primary mass fraction must be in (0,0.5].",
    );
  nonnegative(input.absoluteTolerance, "absoluteTolerance");
  const [x, y, z] = input.position,
    mu = input.massFraction,
    r1 = positive(Math.hypot(x + mu, y, z), "position"),
    r2 = positive(Math.hypot(x - 1 + mu, y, z), "position"),
    jacobiValue =
      x * x +
      y * y +
      (2 * (1 - mu)) / r1 +
      (2 * mu) / r2 -
      dot(input.rotatingVelocity, input.rotatingVelocity),
    absoluteDrift = Math.abs(jacobiValue - input.referenceJacobi);
  return {
    jacobiValue,
    absoluteDrift,
    withinTolerance: absoluteDrift <= input.absoluteTolerance,
  };
};
export const exampleInput = {
  position: [0, 1, 0],
  rotatingVelocity: [0, 0, 0],
  massFraction: 0.5,
  referenceJacobi: 2.7888543819998315,
  absoluteTolerance: 0.001,
} satisfies Input;
export const exampleOutput = {
  jacobiValue: 2.7888543819998315,
  absoluteDrift: 0,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/cr3bp-jacobi-state",
  title: "Cr3Bp Jacobi State",
  description:
    "Evaluate the normalized barycentric rotating-frame Jacobi integral and reference drift; separation, total mass and angular speed are normalized to one.",
  inputs: [
    { id: "position", label: "Position", kind: "numberList" },
    { id: "rotatingVelocity", label: "Rotating velocity", kind: "numberList" },
    { id: "massFraction", label: "Mass fraction", kind: "number" },
    { id: "referenceJacobi", label: "Reference jacobi", kind: "number" },
    { id: "absoluteTolerance", label: "Absolute tolerance", kind: "number" },
  ],
  outputs: [
    { id: "jacobiValue", label: "Jacobi value", kind: "number" },
    { id: "absoluteDrift", label: "Absolute drift", kind: "number" },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      position: value.position as readonly number[],
      rotatingVelocity: value.rotatingVelocity as readonly number[],
      massFraction: value.massFraction as number,
      referenceJacobi: value.referenceJacobi as number,
      absoluteTolerance: value.absoluteTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
