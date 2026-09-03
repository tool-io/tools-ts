import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBlendIngredientMassesG: readonly number[];
  readonly independentSameMethodScovilleAssays: readonly number[];
  readonly callerTargetScoville: number;
}>;
export type Output = Readonly<{
  readonly conditionalMassWeightedScoville: number;
  readonly signedAssayTargetDelta: number;
}>;
const inputFields = [
  {
    id: "observedBlendIngredientMassesG",
    label: "Observed blend ingredient masses g",
    kind: "numberList",
  },
  {
    id: "independentSameMethodScovilleAssays",
    label: "Independent same method scoville assays",
    kind: "numberList",
  },
  {
    id: "callerTargetScoville",
    label: "Caller target scoville",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBlendIngredientMassesG.forEach((v) =>
    nonnegative(v, "observedBlendIngredientMassesG"),
  );
  input.independentSameMethodScovilleAssays.forEach((v) =>
    nonnegative(v, "independentSameMethodScovilleAssays"),
  );
  nonnegative(input.callerTargetScoville, "callerTargetScoville");
  aligned(
    input.observedBlendIngredientMassesG,
    input.independentSameMethodScovilleAssays,
    "observedBlendIngredientMassesG",
  );
  const w = weights(input.observedBlendIngredientMassesG),
    s = sum(input.independentSameMethodScovilleAssays.map((v, i) => v * w[i]));
  return {
    conditionalMassWeightedScoville: s,
    signedAssayTargetDelta: s - input.callerTargetScoville,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBlendIngredientMassesG: [10, 90],
  independentSameMethodScovilleAssays: [10000, 0],
  callerTargetScoville: 500,
} satisfies Input;
export const exampleOutput = {
  conditionalMassWeightedScoville: 1000,
  signedAssayTargetDelta: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/chili-scoville-to-amount",
  title: "Cooking Chili Scoville To Amount Calculator",
  description:
    "Conditional mass-weighted same-method capsaicinoid-equivalent Scoville blend assay, not perceived heat, pepper identity or safe ingestion quantity. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalMassWeightedScoville",
      label: "Conditional mass weighted scoville",
      kind: "number",
    },
    {
      id: "signedAssayTargetDelta",
      label: "Signed assay target delta",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBlendIngredientMassesG:
        value.observedBlendIngredientMassesG as readonly number[],
      independentSameMethodScovilleAssays:
        value.independentSameMethodScovilleAssays as readonly number[],
      callerTargetScoville: value.callerTargetScoville as number,
    }),
});
export const run = tool.execute;
export default tool;
