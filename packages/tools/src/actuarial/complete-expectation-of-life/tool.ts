import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  sum,
  lifeTable,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCompleteAnnualQx: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCompleteAnnualQx",
    label: "Actual complete annual qx",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const l = lifeTable(input.actualCompleteAnnualQx, 1);
  if (input.actualCompleteAnnualQx.at(-1) !== 1)
    simpleError(
      "tail",
      "Completeactualterminallifetimeintervalqx=1,not silently truncatedtail.",
    );
  return {
    conditionalExpectedRemainingYears: sum(
      l.slice(1).map((v, i) => (v + l[i]) / 2),
    ),
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
  input: { actualCompleteAnnualQx: [0.5, 1] },
  output: { result: { conditionalExpectedRemainingYears: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/complete-expectation-of-life",
  title: "Complete Expectation of Life Calculator",
  description:
    "Closedannualtable completeUDDwithinyearlifeexpectationtrapezoid integral of survival,lastqx1andcompleteobservedtail. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
