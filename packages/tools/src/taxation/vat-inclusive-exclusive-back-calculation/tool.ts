import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly inclusiveAmount: number;
  readonly callerVatRateFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "inclusiveAmount", label: "Inclusive amount", kind: "number" },
  {
    id: "callerVatRateFraction",
    label: "Caller vat rate fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.inclusiveAmount, "amount");
  nonnegative(i.callerVatRateFraction, "rate");
  return { exclusiveAmount: i.inclusiveAmount / (1 + i.callerVatRateFraction) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { inclusiveAmount: 120, callerVatRateFraction: 0.2 },
  output: { result: { exclusiveAmount: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/vat-inclusive-exclusive-back-calculation",
  title: "VAT Inclusive Exclusive Back Calculation Tool",
  description:
    "Net amount backed out of a single-rate VAT-inclusive total with independently applicable caller rate; exemptions/rounding and tax liability omitted.",
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
