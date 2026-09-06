import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSelectedTestDrawdownPa: readonly number[];
  readonly callerIndependentlyMatchedZeroSkinDrawdownPa: readonly number[];
  readonly callerRadialNaturalLogDerivativePa: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentTransientTestSkinFactors: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSelectedTestDrawdownPa",
    label: "Observed selected test drawdown pa",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMatchedZeroSkinDrawdownPa",
    label: "Caller independently matched zero skin drawdown pa",
    kind: "numberList",
  },
  {
    id: "callerRadialNaturalLogDerivativePa",
    label: "Caller radial natural log derivative pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRadialNaturalLogDerivativePa.forEach((v) =>
    positive(v, "callerRadialNaturalLogDerivativePa"),
  );
  input.observedSelectedTestDrawdownPa.forEach((v) =>
    nonnegative(v, "observedSelectedTestDrawdownPa"),
  );
  input.callerIndependentlyMatchedZeroSkinDrawdownPa.forEach((v) =>
    nonnegative(v, "callerIndependentlyMatchedZeroSkinDrawdownPa"),
  );
  aligned(
    input.observedSelectedTestDrawdownPa,
    input.callerIndependentlyMatchedZeroSkinDrawdownPa,
    "observedSelectedTestDrawdownPa",
  );
  aligned(
    input.observedSelectedTestDrawdownPa,
    input.callerRadialNaturalLogDerivativePa,
    "observedSelectedTestDrawdownPa",
  );
  return {
    apparentTransientTestSkinFactors: input.observedSelectedTestDrawdownPa.map(
      (v, i) =>
        (v - input.callerIndependentlyMatchedZeroSkinDrawdownPa[i]) /
        (2 * input.callerRadialNaturalLogDerivativePa[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSelectedTestDrawdownPa: [10, 12],
  callerIndependentlyMatchedZeroSkinDrawdownPa: [6, 8],
  callerRadialNaturalLogDerivativePa: [1, 2],
} satisfies Input;
export const exampleOutput = {
  apparentTransientTestSkinFactors: [2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/well-test-skin",
  title: "Petroleum Well Test Skin Calculator",
  description:
    "Extract transient test skin from observed minus independently matched zero-skin drawdown divided by2 natural-log derivative, distinct from pseudo-steady radius/.75 inverse; no damage diagnosis. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentTransientTestSkinFactors",
      label: "Apparent transient test skin factors",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSelectedTestDrawdownPa:
        value.observedSelectedTestDrawdownPa as readonly number[],
      callerIndependentlyMatchedZeroSkinDrawdownPa:
        value.callerIndependentlyMatchedZeroSkinDrawdownPa as readonly number[],
      callerRadialNaturalLogDerivativePa:
        value.callerRadialNaturalLogDerivativePa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
