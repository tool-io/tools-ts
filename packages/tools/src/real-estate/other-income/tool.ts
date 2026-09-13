import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sumMoney,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyDisjointOtherIncomeMinorUnits: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyDisjointOtherIncomeMinorUnits",
    label: "Actual independently disjoint other income minor units",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyDisjointOtherIncomeMinorUnits.length)
    simpleError(
      "actualIndependentlyDisjointOtherIncomeMinorUnits",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyDisjointOtherIncomeMinorUnits.forEach((v) =>
    nonnegative(v, "actualIndependentlyDisjointOtherIncomeMinorUnits"),
  );
  return {
    value: sumMoney(input.actualIndependentlyDisjointOtherIncomeMinorUnits),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyDisjointOtherIncomeMinorUnits: [10, 20] },
  output: { result: { value: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/other-income",
  title: "Other Income Calculator",
  description:
    "Actual disjoint ancillary income source ledgers summed exact safe one-currency minor units, no invent occupancy, prices or recurring market income.",
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
