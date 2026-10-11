import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, survival } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAnnualQx: readonly number[];
  readonly actualYearCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualAnnualQx", label: "Actual annual qx", kind: "numberList" },
  { id: "actualYearCount", label: "Actual year count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return {
    conditionalProbability: survival(
      input.actualAnnualQx,
      0,
      input.actualYearCount,
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAnnualQx: [0.1, 0.2], actualYearCount: 2 },
  output: { result: { conditionalProbability: 0.72 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/tpx-multi-year-survival-probability",
  title: "Multi-Year Survival Probability tPx Calculator",
  description:
    "Conditionalwholeyearsurvival\u03a0pxfromactualsequenceqx,not constanthazardassumed. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalProbability: { type: "number" } },
        required: ["conditionalProbability"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
