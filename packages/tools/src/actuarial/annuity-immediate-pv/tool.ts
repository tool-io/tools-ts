import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualEffectivePeriodInterest: number;
  readonly actualPaymentCount: number;
  readonly actualFirstPaymentAmount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualEffectivePeriodInterest",
    label: "Actual effective period interest",
    kind: "number",
  },
  { id: "actualPaymentCount", label: "Actual payment count", kind: "number" },
  {
    id: "actualFirstPaymentAmount",
    label: "Actual first payment amount",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (input.actualEffectivePeriodInterest <= -1)
    simpleError("interest", "i>-1.");
  bounded(input.actualPaymentCount, "n", 0, 10000);
  nonnegative(input.actualFirstPaymentAmount, "payment");
  let s = 0;
  for (let k = 0; k < input.actualPaymentCount; k++)
    s +=
      (input.actualFirstPaymentAmount * 1) /
      (1 + input.actualEffectivePeriodInterest) ** (k + 1);
  return { presentValue: s };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualEffectivePeriodInterest: 0,
    actualPaymentCount: 3,
    actualFirstPaymentAmount: 1,
  },
  output: { result: { presentValue: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/annuity-immediate-pv",
  title: "Annuity Immediate Present Value Calculator",
  description:
    "Actual Annuity Immediate Present Value Calculatorexplicitcashflowtimingperiods;unitpaymentbaseincludingdeclaredincreasing/decreasing/geometricweights,no embeddedmortality/contractpolicy. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { presentValue: { type: "number" } },
        required: ["presentValue"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
