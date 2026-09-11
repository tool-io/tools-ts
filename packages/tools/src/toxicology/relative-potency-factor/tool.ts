import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  positive,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyMatchedReferenceDosesAtEffects: readonly number[];
  readonly actualMatchedTestSubstanceDosesAtEffects: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyMatchedReferenceDosesAtEffects",
    label: "Caller independently matched reference doses at effects",
    kind: "numberList",
  },
  {
    id: "actualMatchedTestSubstanceDosesAtEffects",
    label: "Actual matched test substance doses at effects",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.callerIndependentlyMatchedReferenceDosesAtEffects,
    input.actualMatchedTestSubstanceDosesAtEffects,
    "effects",
  );
  if (input.actualMatchedTestSubstanceDosesAtEffects.length < 2)
    simpleError("effects", "At least two actual matched effect levels.");
  [
    input.callerIndependentlyMatchedReferenceDosesAtEffects,
    input.actualMatchedTestSubstanceDosesAtEffects,
  ].forEach((v) => v.forEach((x) => positive(x, "endpoint-dose")));
  const r = input.callerIndependentlyMatchedReferenceDosesAtEffects.map(
    (v, i) => v / input.actualMatchedTestSubstanceDosesAtEffects[i],
  );
  return {
    observedRelativePotencyFactorsByEffect: r,
    observedMaximumMinusMinimumRelativePotency: Math.max(...r) - Math.min(...r),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyMatchedReferenceDosesAtEffects: [10, 20],
    actualMatchedTestSubstanceDosesAtEffects: [2, 4],
  },
  output: {
    result: {
      observedRelativePotencyFactorsByEffect: [5, 5],
      observedMaximumMinusMinimumRelativePotency: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/relative-potency-factor",
  title: "Relative Potency Factor Calculator",
  description:
    "Actual same-effect reference/test dose ratios across at least two independently matched endpoint levels, retaining variation rather than inventing a universal relative potency. Common mode, curve parallelism and uncertainty external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
