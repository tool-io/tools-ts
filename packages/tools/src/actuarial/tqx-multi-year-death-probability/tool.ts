import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, survival } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAnnualQx: readonly number[];
  readonly actualYearCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAnnualQx", label: "Actual annual qx", kind: "numberList" },
  { id: "actualYearCount", label: "Actual year count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    conditionalProbability:
      1 - survival(input.actualAnnualQx, 0, input.actualYearCount),
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
  input: { actualAnnualQx: [0.1, 0.2], actualYearCount: 2 },
  output: { result: { conditionalProbability: 0.28 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/tqx-multi-year-death-probability",
  title: "Multi-Year Death Probability tQx Calculator",
  description:
    "Conditionalwholeyeardeath1\u2212\u03a0pxfromactualsequenceqx,not constanthazardassumed. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
