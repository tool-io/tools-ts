import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMaleGrossHourlyPay: number;
  readonly actualFemaleGrossHourlyPay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMaleGrossHourlyPay",
    label: "Actual male gross hourly pay",
    kind: "number",
  },
  {
    id: "actualFemaleGrossHourlyPay",
    label: "Actual female gross hourly pay",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualMaleGrossHourlyPay, "actualMaleGrossHourlyPay");
  nonnegative(input.actualFemaleGrossHourlyPay, "actualFemaleGrossHourlyPay");
  return {
    value:
      (100 *
        (input.actualMaleGrossHourlyPay - input.actualFemaleGrossHourlyPay)) /
      input.actualMaleGrossHourlyPay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMaleGrossHourlyPay: 5, actualFemaleGrossHourlyPay: 4 },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/gender-pay-gap",
  title: "Gender Pay Gap Calculator",
  description:
    "Declared unadjustedgenderpaygap(male\u2212female)/male\u00d7100, actual matched gross hourly group means, census categories externally observed; negative gap retained, no personal gender inference or adjusted causal discrimination estimate.",
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
