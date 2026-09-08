import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  mean,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMatchedMonthlyCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMatchedMonthlyCounts",
    label: "Independently matched monthly counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyMatchedMonthlyCounts.length !== 12)
    simpleError("months", "Exactly 12actual matched monthly observations.");
  input.independentlyMatchedMonthlyCounts.forEach((v) =>
    nonnegative(v, "count"),
  );
  const m = positive(mean(input.independentlyMatchedMonthlyCounts), "mean");
  return {
    observedMonthlyIndices: input.independentlyMatchedMonthlyCounts.map(
      (v) => v / m,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMatchedMonthlyCounts: [
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    ],
  },
  output: {
    result: { observedMonthlyIndices: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/seasonal-index-monthly-crime-calculator",
  title: "Seasonal Index Monthly Crime Calculator",
  description:
    "Actual12-month count/mean seasonal indices on equal or independently normalized exposure; not multi-year seasonal adjustment or forecast of danger.",
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
