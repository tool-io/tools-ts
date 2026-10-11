import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sum,
  lifeTable,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAnnualQx: readonly number[];
  readonly actualTemporaryYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualAnnualQx", label: "Actual annual qx", kind: "numberList" },
  {
    id: "actualTemporaryYears",
    label: "Actual temporary years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(input.actualTemporaryYears, "years", 0, input.actualAnnualQx.length);
  const l = lifeTable(input.actualAnnualQx, 1).slice(
    0,
    input.actualTemporaryYears + 1,
  );
  return {
    conditionalTemporaryCompleteYears: sum(
      l.slice(1).map((v, i) => (v + l[i]) / 2),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAnnualQx: [0.5, 1], actualTemporaryYears: 1 },
  output: { result: { conditionalTemporaryCompleteYears: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/temporary-complete-expectation",
  title: "Temporary Complete Expectation Calculator",
  description:
    "TemporaryUDDwithin-yearcompleteexpectationintegral0\u2026n(actualtable),not assumeopen tailzero or discountannuity. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalTemporaryCompleteYears: { type: "number" } },
        required: ["conditionalTemporaryCompleteYears"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
