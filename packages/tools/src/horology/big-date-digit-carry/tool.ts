import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCurrentDateDay: number;
  readonly callerActualDaysInDisplayedMonth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCurrentDateDay",
    label: "Actual current date day",
    kind: "number",
  },
  {
    id: "callerActualDaysInDisplayedMonth",
    label: "Caller actual days in displayed month",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.callerActualDaysInDisplayedMonth, "monthdays", 28, 31);
  bounded(
    input.actualCurrentDateDay,
    "day",
    1,
    input.callerActualDaysInDisplayedMonth,
  );
  const reset =
      input.actualCurrentDateDay === input.callerActualDaysInDisplayedMonth,
    next = reset ? 1 : input.actualCurrentDateDay + 1;
  return {
    nextDay: next,
    tensDigitCarries:
      !reset &&
      Math.floor(next / 10) !== Math.floor(input.actualCurrentDateDay / 10),
    monthReset: reset,
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
  input: { actualCurrentDateDay: 19, callerActualDaysInDisplayedMonth: 30 },
  output: {
    result: { nextDay: 20, tensDigitCarries: true, monthReset: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/big-date-digit-carry",
  title: "Big Date Digit Carry Calculator",
  description:
    "Actualbig-date decimaldaycarry/independentlyestablishedmonthendreset,not watchsettinginstructions.",
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
