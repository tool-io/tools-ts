import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  fraction,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIntervalQx: number;
  readonly actualIntervalYears: number;
  readonly callerIndependentMeanYearsLivedByDecedents: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualIntervalQx", label: "Actual interval qx", kind: "number" },
  { id: "actualIntervalYears", label: "Actual interval years", kind: "number" },
  {
    id: "callerIndependentMeanYearsLivedByDecedents",
    label: "Caller independent mean years lived by decedents",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  fraction(input.actualIntervalQx, "actualIntervalQx");
  positive(input.actualIntervalYears, "actualIntervalYears");
  nonnegative(
    input.callerIndependentMeanYearsLivedByDecedents,
    "callerIndependentMeanYearsLivedByDecedents",
  );
  if (
    input.callerIndependentMeanYearsLivedByDecedents >
      input.actualIntervalYears ||
    input.actualIntervalYears -
      (input.actualIntervalYears -
        input.callerIndependentMeanYearsLivedByDecedents) *
        input.actualIntervalQx <=
      0
  )
    simpleError("exposure", "Positivepersonyearsand0≤a≤n.");
  return {
    value:
      input.actualIntervalQx /
      (input.actualIntervalYears -
        (input.actualIntervalYears -
          input.callerIndependentMeanYearsLivedByDecedents) *
          input.actualIntervalQx),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIntervalQx: 0.25,
    actualIntervalYears: 2,
    callerIndependentMeanYearsLivedByDecedents: 1,
  },
  output: { result: { value: 0.14285714285714285 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/qx-to-mx-converter",
  title: "Qx to Mx Converter",
  description:
    "Actual inversecentralratemx=qx/[n\u2212(n\u2212a)qx],independenta/no constanthazardassumption. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
