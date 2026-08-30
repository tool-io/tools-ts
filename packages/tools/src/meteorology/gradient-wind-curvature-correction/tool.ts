import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly signedCoriolisPerSecond: number;
  readonly signedCurvatureRadiusM: number;
  readonly geostrophicAlongFlowSpeedMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly normalBranchGradientWindMPerSecond: number;
  readonly gradientMinusGeostrophicMPerSecond: number;
}>;
const inputFields = [
  {
    id: "signedCoriolisPerSecond",
    label: "Signed coriolis per second",
    kind: "number",
  },
  {
    id: "signedCurvatureRadiusM",
    label: "Signed curvature radius m",
    kind: "number",
  },
  {
    id: "geostrophicAlongFlowSpeedMPerSecond",
    label: "Geostrophic along flow speed m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.geostrophicAlongFlowSpeedMPerSecond,
    "geostrophicAlongFlowSpeedMPerSecond",
  );
  const a = input.signedCoriolisPerSecond * input.signedCurvatureRadiusM;
  if (!Number.isFinite(a) || a === 0)
    simpleError("rotation", "Finite nonzero signed fR required.");
  const d = 1 + (4 * input.geostrophicAlongFlowSpeedMPerSecond) / a;
  if (d < 0)
    simpleError(
      "balance",
      "No real normal-branch gradient wind for declared anticyclonic curvature.",
    );
  const normalBranchGradientWindMPerSecond =
    (2 * input.geostrophicAlongFlowSpeedMPerSecond) / (1 + Math.sqrt(d));
  return {
    normalBranchGradientWindMPerSecond,
    gradientMinusGeostrophicMPerSecond:
      normalBranchGradientWindMPerSecond -
      input.geostrophicAlongFlowSpeedMPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedCoriolisPerSecond: 0.0001,
  signedCurvatureRadiusM: 100000,
  geostrophicAlongFlowSpeedMPerSecond: 10,
} satisfies Input;
export const exampleOutput = {
  normalBranchGradientWindMPerSecond: 6.180339887498949,
  gradientMinusGeostrophicMPerSecond: -3.819660112501051,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/gradient-wind-curvature-correction",
  title: "Gradient Wind Curvature Correction",
  description:
    "Solve continuous geostrophic-limit normal branch of V²/(fR)+V=Vg with signed curvature, rejecting no-real anticyclonic balance; no anomalous branch, surface gusts or safe-flight inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalBranchGradientWindMPerSecond",
      label: "Normal branch gradient wind m per second",
      kind: "number",
    },
    {
      id: "gradientMinusGeostrophicMPerSecond",
      label: "Gradient minus geostrophic m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      signedCoriolisPerSecond: value.signedCoriolisPerSecond as number,
      signedCurvatureRadiusM: value.signedCurvatureRadiusM as number,
      geostrophicAlongFlowSpeedMPerSecond:
        value.geostrophicAlongFlowSpeedMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
