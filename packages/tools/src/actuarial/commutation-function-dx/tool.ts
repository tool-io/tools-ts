import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerActualAnnualDiscountFactor: number;
  readonly actualAttainedAge: number;
  readonly actualLifeTableSurvivors: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerActualAnnualDiscountFactor",
    label: "Caller actual annual discount factor",
    kind: "number",
  },
  { id: "actualAttainedAge", label: "Actual attained age", kind: "number" },
  {
    id: "actualLifeTableSurvivors",
    label: "Actual life table survivors",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  fraction(
    input.callerActualAnnualDiscountFactor,
    "callerActualAnnualDiscountFactor",
  );
  bounded(input.actualAttainedAge, "actualAttainedAge", 0, 1000000);
  nonnegative(input.actualLifeTableSurvivors, "actualLifeTableSurvivors");
  return {
    value:
      input.callerActualAnnualDiscountFactor ** input.actualAttainedAge *
      input.actualLifeTableSurvivors,
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
    callerActualAnnualDiscountFactor: 0.5,
    actualAttainedAge: 2,
    actualLifeTableSurvivors: 100,
  },
  output: { result: { value: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/commutation-function-dx",
  title: "Commutation Function Dx Calculator",
  description:
    "CommutationD_x=v^x l_xdefinedabsoluteageexponent,not deferredNPVpayment. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
