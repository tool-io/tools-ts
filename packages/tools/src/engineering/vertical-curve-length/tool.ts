import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerAlgebraicGradeDifferenceFraction: number;
  readonly callerMaximumVerticalCurvaturePerM: number;
}>;
export type Output = Readonly<{
  readonly curvatureLimitedParabolicCurveLengthM: number;
}>;
const inputFields = [
  {
    id: "callerAlgebraicGradeDifferenceFraction",
    label: "Caller algebraic grade difference fraction",
    kind: "number",
  },
  {
    id: "callerMaximumVerticalCurvaturePerM",
    label: "Caller maximum vertical curvature per m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumVerticalCurvaturePerM,
    "callerMaximumVerticalCurvaturePerM",
  );
  return {
    curvatureLimitedParabolicCurveLengthM:
      Math.abs(input.callerAlgebraicGradeDifferenceFraction) /
      input.callerMaximumVerticalCurvaturePerM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAlgebraicGradeDifferenceFraction: 0.04,
  callerMaximumVerticalCurvaturePerM: 0.002,
} satisfies Input;
export const exampleOutput = {
  curvatureLimitedParabolicCurveLengthM: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/vertical-curve-length",
  title: "Vertical Curve Length Calculator",
  description:
    "Constant-curvature parabolic grade transition with independently set curvature bound; not sight-distance or minimum highway-code design. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "curvatureLimitedParabolicCurveLengthM",
      label: "Curvature limited parabolic curve length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAlgebraicGradeDifferenceFraction:
        value.callerAlgebraicGradeDifferenceFraction as number,
      callerMaximumVerticalCurvaturePerM:
        value.callerMaximumVerticalCurvaturePerM as number,
    }),
});
export const run = tool.execute;
export default tool;
