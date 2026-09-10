import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly immigrantCounts: readonly number[];
  readonly emigrantCounts: readonly number[];
  readonly matchedPopulationPersonYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "immigrantCounts", label: "Immigrant counts", kind: "numberList" },
  { id: "emigrantCounts", label: "Emigrant counts", kind: "numberList" },
  {
    id: "matchedPopulationPersonYears",
    label: "Matched population person years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  for (const v of [input.immigrantCounts, input.emigrantCounts]) {
    aligned(v, input.matchedPopulationPersonYears, "strata");
    v.forEach((x) => nonnegative(x, "count"));
  }
  input.matchedPopulationPersonYears.forEach((v) => nonnegative(v, "exposure"));
  const p = positive(sum(input.matchedPopulationPersonYears), "exposure");
  return {
    observedSignedRatePer1000:
      (1000 * (sum(input.immigrantCounts) - sum(input.emigrantCounts))) / p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    immigrantCounts: [2, 4],
    emigrantCounts: [2, 4],
    matchedPopulationPersonYears: [10, 20],
  },
  output: { result: { observedSignedRatePer1000: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/net-migration-rate",
  title: "Net Migration Rate Calculator",
  description:
    "Observed net migration per 1,000 matched population-person-years. Actual disjoint same-period strata and classifications required; sign retained and no causal inference.",
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
