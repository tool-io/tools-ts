import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  sum,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyObservedAggregateCategoryShares: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyObservedAggregateCategoryShares",
    label: "Actual independently observed aggregate category shares",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyObservedAggregateCategoryShares.length)
    simpleError(
      "actualIndependentlyObservedAggregateCategoryShares",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyObservedAggregateCategoryShares.forEach((v) =>
    fraction(v, "actualIndependentlyObservedAggregateCategoryShares"),
  );
  if (
    Math.abs(
      sum(input.actualIndependentlyObservedAggregateCategoryShares) - 1,
    ) > 1e-9
  )
    simpleError("shares", "Actualcompletepartition.");
  return {
    value: sum(
      input.actualIndependentlyObservedAggregateCategoryShares.map(
        (v) => v * v,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyObservedAggregateCategoryShares: [0.5, 0.5] },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/cultural-homogeneity-index",
  title: "Cultural Homogeneity Index Calculator",
  description:
    "Declared Simpson concentration cultural homogeneity\u03a3p\u00b2under actual mutually exclusive aggregate categories, not universal cultural sameness or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
