import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly exclusiveAmount: number;
  readonly callerVatRateFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "exclusiveAmount", label: "Exclusive amount", kind: "number" },
  {
    id: "callerVatRateFraction",
    label: "Caller vat rate fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.exclusiveAmount, "amount");
  nonnegative(i.callerVatRateFraction, "rate");
  return { inclusiveAmount: i.exclusiveAmount * (1 + i.callerVatRateFraction) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { exclusiveAmount: 100, callerVatRateFraction: 0.2 },
  output: { result: { inclusiveAmount: 120 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/exclusive-to-inclusive-vat-forward-add",
  title: "Exclusive To Inclusive VAT Forward Add Calculator",
  description:
    "Single-rate VAT gross amount from actual net amount and independently applicable caller rate; not country/rate selection or invoice compliance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
