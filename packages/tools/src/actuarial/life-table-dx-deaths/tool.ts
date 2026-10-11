import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualStartLifeTableSurvivors: number;
  readonly actualIntervalQx: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualStartLifeTableSurvivors",
    label: "Actual start life table survivors",
    kind: "number",
  },
  { id: "actualIntervalQx", label: "Actual interval qx", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.actualStartLifeTableSurvivors,
    "actualStartLifeTableSurvivors",
  );
  fraction(input.actualIntervalQx, "actualIntervalQx");
  return {
    value: input.actualStartLifeTableSurvivors * input.actualIntervalQx,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualStartLifeTableSurvivors: 10, actualIntervalQx: 0.2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/life-table-dx-deaths",
  title: "Life Table Dx Deaths Calculator",
  description:
    "Actuald_x=l_xq_xexpectedcohortdeaths,mayscalefractional,not individualeventcounts. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
