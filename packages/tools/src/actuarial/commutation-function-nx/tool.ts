import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMatchedDxFromXOnward: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMatchedDxFromXOnward",
    label: "Actual matched dx from x onward",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualMatchedDxFromXOnward.length)
    simpleError("Dx", "Actualcompletepositive tail.");
  input.actualMatchedDxFromXOnward.forEach((v) => nonnegative(v, "Dx"));
  return { commutationNx: sum(input.actualMatchedDxFromXOnward) };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualMatchedDxFromXOnward: [10, 5, 2] },
  output: { result: { commutationNx: 17 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/commutation-function-nx",
  title: "Commutation Function Nx Calculator",
  description:
    "CommutationN_x=\u03a3k\u2265xD_k,independentlycompleteactualtailprovided,no mortalitytableinvented. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
