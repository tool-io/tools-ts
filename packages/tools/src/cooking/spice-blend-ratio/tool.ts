import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSpiceMassesG: readonly number[];
  readonly callerDesiredBlendWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBlendFractions: readonly number[];
  readonly signedTargetMassDiscrepanciesG: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSpiceMassesG",
    label: "Observed spice masses g",
    kind: "numberList",
  },
  {
    id: "callerDesiredBlendWeights",
    label: "Caller desired blend weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSpiceMassesG.forEach((v) =>
    nonnegative(v, "observedSpiceMassesG"),
  );
  input.callerDesiredBlendWeights.forEach((v) =>
    nonnegative(v, "callerDesiredBlendWeights"),
  );
  aligned(
    input.observedSpiceMassesG,
    input.callerDesiredBlendWeights,
    "observedSpiceMassesG",
  );
  const total = positive(sum(input.observedSpiceMassesG), "blendmass"),
    w = weights(input.callerDesiredBlendWeights);
  return {
    observedBlendFractions: input.observedSpiceMassesG.map((v) => v / total),
    signedTargetMassDiscrepanciesG: input.observedSpiceMassesG.map(
      (v, i) => v - total * w[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpiceMassesG: [10, 20, 30],
  callerDesiredBlendWeights: [1, 1, 2],
} satisfies Input;
export const exampleOutput = {
  observedBlendFractions: [0.16666666666666666, 0.3333333333333333, 0.5],
  signedTargetMassDiscrepanciesG: [-5, 5, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/spice-blend-ratio",
  title: "Cooking Spice Blend Ratio Calculator",
  description:
    "Actual multi-spice blend fraction discrepancies against caller normalized target weights, no universal blend or substitution equivalence. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBlendFractions",
      label: "Observed blend fractions",
      kind: "numberList",
    },
    {
      id: "signedTargetMassDiscrepanciesG",
      label: "Signed target mass discrepancies g",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSpiceMassesG: value.observedSpiceMassesG as readonly number[],
      callerDesiredBlendWeights:
        value.callerDesiredBlendWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
