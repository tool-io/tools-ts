import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedElementCounts: readonly number[];
  readonly callerPerCategoryPenaltyWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedElementCounts",
    label: "Independently annotated element counts",
    kind: "numberList",
  },
  {
    id: "callerPerCategoryPenaltyWeights",
    label: "Caller per category penalty weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.independentlyAnnotatedElementCounts.forEach((v) =>
    nonnegative(v, "independentlyAnnotatedElementCounts"),
  );
  input.callerPerCategoryPenaltyWeights.forEach((v) =>
    nonnegative(v, "callerPerCategoryPenaltyWeights"),
  );
  aligned(
    input.independentlyAnnotatedElementCounts,
    input.callerPerCategoryPenaltyWeights,
    "independentlyAnnotatedElementCounts",
  );
  input.independentlyAnnotatedElementCounts.forEach((v) => integer(v, "count"));
  return {
    totalElementCount: sum(input.independentlyAnnotatedElementCounts),
    callerWeightedComplexity: sum(
      input.independentlyAnnotatedElementCounts.map(
        (v, i) => v * input.callerPerCategoryPenaltyWeights[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedElementCounts: [3, 2, 1],
    callerPerCategoryPenaltyWeights: [1, 2, 3],
  },
  output: { result: { totalElementCount: 6, callerWeightedComplexity: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/complexity-element-counter",
  title: "Complexity Element Counter Scorer",
  description:
    "Count independently annotated nonoverlapping design elements with explicit caller weights; no universal complexity score or image segmentation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
