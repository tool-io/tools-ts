import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedMedianPoorIncome: number;
  readonly callerApplicablePovertyThreshold: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedMedianPoorIncome",
    label: "Independently verified median poor income",
    kind: "number",
  },
  {
    id: "callerApplicablePovertyThreshold",
    label: "Caller applicable poverty threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyVerifiedMedianPoorIncome, "income");
  positive(input.callerApplicablePovertyThreshold, "threshold");
  return {
    conditionalRelativeMedianGapPercent:
      (100 *
        (input.callerApplicablePovertyThreshold -
          input.independentlyVerifiedMedianPoorIncome)) /
      input.callerApplicablePovertyThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedMedianPoorIncome: 60,
    callerApplicablePovertyThreshold: 100,
  },
  output: { result: { conditionalRelativeMedianGapPercent: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/relative-median-income-gap",
  title: "Relative Median Income Gap Calculator",
  description:
    "Signed relative median poor-income gap against independently applicable same-unit threshold; selection of poor cohort and median external. Negative discrepancy retained, not silently classified as impossible evidence.",
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
