import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLevelPeriodicPayment: number;
  readonly actualPositiveEffectivePeriodInterest: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLevelPeriodicPayment",
    label: "Actual level periodic payment",
    kind: "number",
  },
  {
    id: "actualPositiveEffectivePeriodInterest",
    label: "Actual positive effective period interest",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualLevelPeriodicPayment, "actualLevelPeriodicPayment");
  positive(
    input.actualPositiveEffectivePeriodInterest,
    "actualPositiveEffectivePeriodInterest",
  );
  return {
    value:
      (input.actualLevelPeriodicPayment *
        (1 + input.actualPositiveEffectivePeriodInterest)) /
      input.actualPositiveEffectivePeriodInterest,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualLevelPeriodicPayment: 1,
    actualPositiveEffectivePeriodInterest: 0.5,
  },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/perpetuity-due-pv",
  title: "Perpetuity Due Present Value Calculator",
  description:
    "Levelinfiniteperpetuity duefirstpaymentnow,actualconstantpositiveinterest/no mortaltail. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
