import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIntervalYears: number;
  readonly actualCentralDeathRate: number;
  readonly callerIndependentMeanYearsLivedByDecedents: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualIntervalYears", label: "Actual interval years", kind: "number" },
  {
    id: "actualCentralDeathRate",
    label: "Actual central death rate",
    kind: "number",
  },
  {
    id: "callerIndependentMeanYearsLivedByDecedents",
    label: "Caller independent mean years lived by decedents",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualIntervalYears, "actualIntervalYears");
  nonnegative(input.actualCentralDeathRate, "actualCentralDeathRate");
  nonnegative(
    input.callerIndependentMeanYearsLivedByDecedents,
    "callerIndependentMeanYearsLivedByDecedents",
  );
  if (
    input.callerIndependentMeanYearsLivedByDecedents > input.actualIntervalYears
  )
    simpleError("a", "0≤a≤n.");
  if (
    input.actualIntervalYears * input.actualCentralDeathRate >
    1 +
      (input.actualIntervalYears -
        input.callerIndependentMeanYearsLivedByDecedents) *
        input.actualCentralDeathRate
  )
    simpleError("qx", "Consistentqx≤1.");
  return {
    value:
      (input.actualIntervalYears * input.actualCentralDeathRate) /
      (1 +
        (input.actualIntervalYears -
          input.callerIndependentMeanYearsLivedByDecedents) *
          input.actualCentralDeathRate),
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
    actualIntervalYears: 2,
    actualCentralDeathRate: 0.2,
    callerIndependentMeanYearsLivedByDecedents: 1,
  },
  output: { result: { value: 0.33333333333333337 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/mx-to-qx-converter",
  title: "Mx to Qx Converter",
  description:
    "Actual n-yearqx=nmx/[1+(n\u2212a)mx],aindependentlyknownwithininterval,noUDDforced. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
