import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fitPower } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedTreeDiametersCm: readonly number[];
  readonly observedTreeHeightsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedDiameterHeightExponent: number;
  readonly fittedHeightPrefactor: number;
  readonly allometryFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedTreeDiametersCm",
    label: "Observed tree diameters cm",
    kind: "numberList",
  },
  {
    id: "observedTreeHeightsM",
    label: "Observed tree heights m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = fitPower(input.observedTreeDiametersCm, input.observedTreeHeightsM);
  return {
    fittedDiameterHeightExponent: f.exponent,
    fittedHeightPrefactor: f.prefactor,
    allometryFitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTreeDiametersCm: [10, 20, 40],
  observedTreeHeightsM: [5, 10, 20],
} satisfies Input;
export const exampleOutput = {
  fittedDiameterHeightExponent: 1,
  fittedHeightPrefactor: 0.5,
  allometryFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/diameter-height-allometry",
  title: "Diameter Height Allometry Calculator",
  description:
    "Extract actual paired diameter-height power allometry and diagnostics, not predefined Näslund height curve or universal species equation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedDiameterHeightExponent",
      label: "Fitted diameter height exponent",
      kind: "number",
    },
    {
      id: "fittedHeightPrefactor",
      label: "Fitted height prefactor",
      kind: "number",
    },
    {
      id: "allometryFitRSquared",
      label: "Allometry fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTreeDiametersCm:
        value.observedTreeDiametersCm as readonly number[],
      observedTreeHeightsM: value.observedTreeHeightsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
