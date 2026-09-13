import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  money,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentApplicablePurchasePriceCapsMinorUnits: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentApplicablePurchasePriceCapsMinorUnits",
    label: "Caller independent applicable purchase price caps minor units",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.callerIndependentApplicablePurchasePriceCapsMinorUnits.length)
    simpleError(
      "callerIndependentApplicablePurchasePriceCapsMinorUnits",
      "Actual nonempty observations.",
    );
  input.callerIndependentApplicablePurchasePriceCapsMinorUnits.forEach((v) =>
    nonnegative(v, "callerIndependentApplicablePurchasePriceCapsMinorUnits"),
  );
  input.callerIndependentApplicablePurchasePriceCapsMinorUnits.forEach((v) =>
    money(v, "pricecap"),
  );
  return {
    value: Math.min(
      ...input.callerIndependentApplicablePurchasePriceCapsMinorUnits,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerIndependentApplicablePurchasePriceCapsMinorUnits: [100, 200] },
  output: { result: { value: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/home-affordability",
  title: "Home Affordability Calculator",
  description:
    "Minimum actual independently lender/borrower assessed purchase price caps, one currency minor units, not derive a universal income multiplier, mortgage eligibility or lending approval.",
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
