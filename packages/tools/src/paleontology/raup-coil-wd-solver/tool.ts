import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  ordered,
  mean,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly cumulativeTurns: readonly number[];
  readonly outerWhorlRadiiMm: readonly number[];
  readonly innerWhorlRadiiMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedWhorlExpansionW: number;
  readonly meanInnerOuterDistanceD: number;
  readonly logRadiusFitRSquared: number;
}>;
const inputFields = [
  { id: "cumulativeTurns", label: "Cumulative turns", kind: "numberList" },
  {
    id: "outerWhorlRadiiMm",
    label: "Outer whorl radii mm",
    kind: "numberList",
  },
  {
    id: "innerWhorlRadiiMm",
    label: "Inner whorl radii mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.outerWhorlRadiiMm.forEach((v) => positive(v, "outerWhorlRadiiMm"));
  input.innerWhorlRadiiMm.forEach((v) => nonnegative(v, "innerWhorlRadiiMm"));
  aligned(input.cumulativeTurns, input.outerWhorlRadiiMm, "cumulativeTurns");
  aligned(input.cumulativeTurns, input.innerWhorlRadiiMm, "cumulativeTurns");
  ordered(input.cumulativeTurns, "cumulativeTurns");
  const d = input.outerWhorlRadiiMm.map((v, i) =>
      fraction(input.innerWhorlRadiiMm[i] / v, "innerWhorlRadiiMm"),
    ),
    fit = regression(
      input.cumulativeTurns,
      input.outerWhorlRadiiMm.map(Math.log),
    );
  positive(fit.slope, "expansionSlope");
  return {
    fittedWhorlExpansionW: Math.exp(fit.slope),
    meanInnerOuterDistanceD: mean(d),
    logRadiusFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cumulativeTurns: [0, 1, 2],
  outerWhorlRadiiMm: [10, 20, 40],
  innerWhorlRadiiMm: [5, 10, 20],
} satisfies Input;
export const exampleOutput = {
  fittedWhorlExpansionW: 2,
  meanInnerOuterDistanceD: 0.5,
  logRadiusFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/raup-coil-wd-solver",
  title: "Raup Coil Log-Spiral W-D Parameters Solver",
  description:
    "Fit logarithmic whorl radial expansion per full turn and report Raup-style D under explicit inner/outer radius convention; only W/D are estimated, not generating shape, axial translation or 3D reconstruction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedWhorlExpansionW",
      label: "Fitted whorl expansion w",
      kind: "number",
    },
    {
      id: "meanInnerOuterDistanceD",
      label: "Mean inner outer distance d",
      kind: "number",
    },
    {
      id: "logRadiusFitRSquared",
      label: "Log radius fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cumulativeTurns: value.cumulativeTurns as readonly number[],
      outerWhorlRadiiMm: value.outerWhorlRadiiMm as readonly number[],
      innerWhorlRadiiMm: value.innerWhorlRadiiMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
