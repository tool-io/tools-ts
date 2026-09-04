import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mccabe } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerEquilibriumLiquidFractions: readonly number[];
  readonly callerEquilibriumVaporFractions: readonly number[];
  readonly distillateFraction: number;
  readonly bottomTargetFraction: number;
  readonly refluxRatio: number;
  readonly maximumRectifyingStages: number;
}>;
export type Output = Readonly<{
  readonly stageLiquidCompositions: readonly number[];
  readonly reachedBottom: boolean;
}>;
const inputFields = [
  {
    id: "callerEquilibriumLiquidFractions",
    label: "Caller equilibrium liquid fractions",
    kind: "numberList",
  },
  {
    id: "callerEquilibriumVaporFractions",
    label: "Caller equilibrium vapor fractions",
    kind: "numberList",
  },
  { id: "distillateFraction", label: "Distillate fraction", kind: "number" },
  {
    id: "bottomTargetFraction",
    label: "Bottom target fraction",
    kind: "number",
  },
  { id: "refluxRatio", label: "Reflux ratio", kind: "number" },
  {
    id: "maximumRectifyingStages",
    label: "Maximum rectifying stages",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return mccabe(
    input.callerEquilibriumLiquidFractions,
    input.callerEquilibriumVaporFractions,
    input.distillateFraction,
    input.bottomTargetFraction,
    input.refluxRatio,
    input.maximumRectifyingStages,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEquilibriumLiquidFractions: [0, 0.5, 1],
  callerEquilibriumVaporFractions: [0, 0.75, 1],
  distillateFraction: 0.75,
  bottomTargetFraction: 0.5,
  refluxRatio: 1,
  maximumRectifyingStages: 10,
} satisfies Input;
export const exampleOutput = {
  stageLiquidCompositions: [0.5],
  reachedBottom: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/mccabe-thiele-stages",
  title: "McCabe-Thiele Stages Calculator",
  description:
    "Bounded McCabe–Thiele RECTIFYING-ONLY graphical stepping, condenser excluded, feed/stripping/reboiler not modeled and stage cap censoring explicit. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "stageLiquidCompositions",
      label: "Stage liquid compositions",
      kind: "numberList",
    },
    { id: "reachedBottom", label: "Reached bottom", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      callerEquilibriumLiquidFractions:
        value.callerEquilibriumLiquidFractions as readonly number[],
      callerEquilibriumVaporFractions:
        value.callerEquilibriumVaporFractions as readonly number[],
      distillateFraction: value.distillateFraction as number,
      bottomTargetFraction: value.bottomTargetFraction as number,
      refluxRatio: value.refluxRatio as number,
      maximumRectifyingStages: value.maximumRectifyingStages as number,
    }),
});
export const run = tool.execute;
export default tool;
