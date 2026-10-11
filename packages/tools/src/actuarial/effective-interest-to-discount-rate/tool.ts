import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualEffectiveAnnualInterest: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualEffectiveAnnualInterest",
    label: "Actual effective annual interest",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (input.actualEffectiveAnnualInterest <= -1)
    simpleError("interest", "i>-1.");
  return {
    value:
      input.actualEffectiveAnnualInterest /
      (1 + input.actualEffectiveAnnualInterest),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualEffectiveAnnualInterest: 1 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/effective-interest-to-discount-rate",
  title: "Effective Interest to Discount Rate Converter",
  description:
    "Effectivei\u2192discountd=i/(1+i) Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
