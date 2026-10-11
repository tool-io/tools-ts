import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLifeTableLx: number;
  readonly actualLifeTableLxPlusInterval: number;
  readonly actualIntervalYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualLifeTableLx", label: "Actual life table lx", kind: "number" },
  {
    id: "actualLifeTableLxPlusInterval",
    label: "Actual life table lx plus interval",
    kind: "number",
  },
  { id: "actualIntervalYears", label: "Actual interval years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualLifeTableLx, "actualLifeTableLx");
  positive(
    input.actualLifeTableLxPlusInterval,
    "actualLifeTableLxPlusInterval",
  );
  positive(input.actualIntervalYears, "actualIntervalYears");
  if (input.actualLifeTableLxPlusInterval > input.actualLifeTableLx)
    simpleError("survivors", "Actualpositive nonincreasinglx.");
  return {
    value:
      Math.log(input.actualLifeTableLx / input.actualLifeTableLxPlusInterval) /
      input.actualIntervalYears,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualLifeTableLx: 10,
    actualLifeTableLxPlusInterval: 5,
    actualIntervalYears: 1,
  },
  output: { result: { value: 0.6931471805599453 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/force-of-mortality-from-lx",
  title: "Force of Mortality From lx Calculator",
  description:
    "IntervalAVERAGEforce\u2212ln(lend/lstart)/\u0394,not pointderivativewithoutagegrid. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
