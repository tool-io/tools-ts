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
  readonly actualNominalAnnualRate: number;
  readonly actualCompoundsPerYear: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualNominalAnnualRate",
    label: "Actual nominal annual rate",
    kind: "number",
  },
  {
    id: "actualCompoundsPerYear",
    label: "Actual compounds per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(input.actualCompoundsPerYear, "actualCompoundsPerYear", 1, 1000000);
  if (input.actualNominalAnnualRate / input.actualCompoundsPerYear <= -1)
    simpleError("rate", "Positiveaccumulationbase.");
  return {
    value:
      (1 + input.actualNominalAnnualRate / input.actualCompoundsPerYear) **
        input.actualCompoundsPerYear -
      1,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualNominalAnnualRate: 0.1, actualCompoundsPerYear: 2 },
  output: { result: { value: 0.10250000000000004 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/nominal-to-effective-interest-pthly",
  title: "Nominal to Effective Interest P-thly Converter",
  description:
    "Nominalj convertiblep times\u2192effective(1+j/p)^p\u22121 Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
