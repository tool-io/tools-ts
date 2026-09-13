import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualEffectiveAnnualInterest: number;
  readonly actualPeriodCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEffectiveAnnualInterest",
    label: "Actual effective annual interest",
    kind: "number",
  },
  { id: "actualPeriodCount", label: "Actual period count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualPeriodCount, "actualPeriodCount", 0, 1000000);
  if (input.actualEffectiveAnnualInterest <= -1)
    simpleError("interest", "i>-1.");
  return {
    value:
      (1 + input.actualEffectiveAnnualInterest) ** -input.actualPeriodCount,
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
  input: { actualEffectiveAnnualInterest: 1, actualPeriodCount: 2 },
  output: { result: { value: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/discount-factor-v-power-n",
  title: "Discount Factor V Power N Calculator",
  description:
    "Discountv^n Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
