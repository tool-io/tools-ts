import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fitPower } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedQuadraticDbhCm: readonly number[];
  readonly observedStandDensityHa: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedReinekeDensityDbhExponent: number;
  readonly reinekeFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedQuadraticDbhCm",
    label: "Observed quadratic dbh cm",
    kind: "numberList",
  },
  {
    id: "observedStandDensityHa",
    label: "Observed stand density ha",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = fitPower(
    input.observedQuadraticDbhCm,
    input.observedStandDensityHa,
  );
  return {
    fittedReinekeDensityDbhExponent: f.exponent,
    reinekeFitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQuadraticDbhCm: [10, 20, 40],
  observedStandDensityHa: [400, 100, 25],
} satisfies Input;
export const exampleOutput = {
  fittedReinekeDensityDbhExponent: -2,
  reinekeFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/reineke-slope",
  title: "Reineke Slope Calculator",
  description:
    "Extract actual Reineke log density/log quadratic DBH slope instead of fixed 1.605 stand density exponent or self-thinning stem-mass slope. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedReinekeDensityDbhExponent",
      label: "Fitted reineke density dbh exponent",
      kind: "number",
    },
    {
      id: "reinekeFitRSquared",
      label: "Reineke fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedQuadraticDbhCm: value.observedQuadraticDbhCm as readonly number[],
      observedStandDensityHa: value.observedStandDensityHa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
