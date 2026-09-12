import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWvRatioDenominatorMlPerGram: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedWvRatioDenominatorMlPerGram",
    label: "Caller verified wv ratio denominator ml per gram",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVerifiedWvRatioDenominatorMlPerGram,
    "callerVerifiedWvRatioDenominatorMlPerGram",
  );
  return { value: 100 / input.callerVerifiedWvRatioDenominatorMlPerGram };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerVerifiedWvRatioDenominatorMlPerGram: 20 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/percent-strength-conversion-ratio-proportion",
  title: "Percent Strength Ratio-Proportion Converter",
  description:
    "Explicit1g:N mLw/vratio\u2192gper100mLpercentage, N>0, not1volume:Ntotalvolume or arbitrary drug strength unit. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
