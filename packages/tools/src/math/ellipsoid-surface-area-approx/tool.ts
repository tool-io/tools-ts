import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch-shared.js";
export type Input = Readonly<{
  readonly semiAxes: readonly number[];
  readonly powerMeanExponent: number;
}>;
export type Output = Readonly<{ readonly approximateSurfaceArea: number }>;
const inputFields = [
  { id: "semiAxes", label: "Semi axes", kind: "numberList" },
  { id: "powerMeanExponent", label: "Power mean exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.semiAxes.forEach((v) => positive(v, "semiAxes"));
  positive(input.powerMeanExponent, "powerMeanExponent");
  if (
    input.semiAxes.length !== 3 ||
    input.powerMeanExponent < 1 ||
    input.powerMeanExponent > 2
  )
    simpleError(
      "axes",
      "Three positive semiaxes and exponent in [1,2] required.",
    );
  const [a, b, c] = input.semiAxes,
    p = input.powerMeanExponent;
  return {
    approximateSurfaceArea:
      4 *
      Math.PI *
      (((a * b) ** p + (a * c) ** p + (b * c) ** p) / 3) ** (1 / p),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  semiAxes: [2, 2, 2],
  powerMeanExponent: 1.6075,
} satisfies Input;
export const exampleOutput = {
  approximateSurfaceArea: 50.26548245743669,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/ellipsoid-surface-area-approx",
  title: "Ellipsoid Surface Area Approximation",
  description:
    "Evaluate supplied power-mean ellipsoid surface-area approximation (Knud Thomsen exponent 1.6075 commonly used); exact for spheres, approximate otherwise, no implied error guarantee for arbitrary caller exponent.",
  inputs: inputFields,
  outputs: [
    {
      id: "approximateSurfaceArea",
      label: "Approximate surface area",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      semiAxes: value.semiAxes as readonly number[],
      powerMeanExponent: value.powerMeanExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
