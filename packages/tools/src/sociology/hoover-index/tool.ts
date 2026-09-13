import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  mean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualNonnegativeIncomeObservations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNonnegativeIncomeObservations",
    label: "Actual nonnegative income observations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualNonnegativeIncomeObservations.length)
    simpleError(
      "actualNonnegativeIncomeObservations",
      "Actual nonempty observations.",
    );
  input.actualNonnegativeIncomeObservations.forEach((v) =>
    nonnegative(v, "actualNonnegativeIncomeObservations"),
  );
  positive(sum(input.actualNonnegativeIncomeObservations), "totalincome");
  return {
    value:
      sum(
        input.actualNonnegativeIncomeObservations.map((v) =>
          Math.abs(v - mean(input.actualNonnegativeIncomeObservations)),
        ),
      ) /
      (2 * sum(input.actualNonnegativeIncomeObservations)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNonnegativeIncomeObservations: [1, 3] },
  output: { result: { value: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/hoover-index",
  title: "Hoover Index Calculator",
  description:
    "Observed Hoover income inequality\u00bd\u03a3|xi\u2212mean|/\u03a3xi, unweightedcompletepeople, nonnegative incomes/positive total. Not an income level or causalredistributionpolicy.",
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
