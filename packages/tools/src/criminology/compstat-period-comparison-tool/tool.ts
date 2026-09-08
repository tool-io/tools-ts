import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerOffenseCategoryIds: readonly string[];
  readonly previousMatchedPeriodCounts: readonly number[];
  readonly currentMatchedPeriodCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerOffenseCategoryIds",
    label: "Caller offense category ids",
    kind: "stringList",
  },
  {
    id: "previousMatchedPeriodCounts",
    label: "Previous matched period counts",
    kind: "numberList",
  },
  {
    id: "currentMatchedPeriodCounts",
    label: "Current matched period counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerOffenseCategoryIds, "categories");
  aligned(
    input.callerOffenseCategoryIds,
    input.previousMatchedPeriodCounts,
    "previous",
  );
  aligned(
    input.callerOffenseCategoryIds,
    input.currentMatchedPeriodCounts,
    "current",
  );
  [input.previousMatchedPeriodCounts, input.currentMatchedPeriodCounts].forEach(
    (v) => v.forEach((x) => nonnegative(x, "count")),
  );
  return {
    signedCategoryCountChanges: input.currentMatchedPeriodCounts.map(
      (v, i) => v - input.previousMatchedPeriodCounts[i],
    ),
    relativeChangeKnownFlags: input.previousMatchedPeriodCounts.map((v) =>
      v ? 1 : 0,
    ),
    signedCategoryChangePercents: input.currentMatchedPeriodCounts.map(
      (v, i) =>
        input.previousMatchedPeriodCounts[i]
          ? (100 * (v - input.previousMatchedPeriodCounts[i])) /
            input.previousMatchedPeriodCounts[i]
          : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerOffenseCategoryIds: ["a", "b"],
    previousMatchedPeriodCounts: [10, 0],
    currentMatchedPeriodCounts: [5, 3],
  },
  output: {
    result: {
      signedCategoryCountChanges: [-5, 3],
      relativeChangeKnownFlags: [1, 0],
      signedCategoryChangePercents: [-50, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/compstat-period-comparison-tool",
  title: "CompStat Period Comparison Tool",
  description:
    "Actual independently harmonized CompStatcategory comparison, zero previous count has unknown-relative flag with explicit zero placeholder. Not causal effectiveness or infer true incidence from recording changes.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
