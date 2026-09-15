import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, manuscriptRoman } from "../batch52-shared.js";
export type Input = Readonly<{ readonly manuscriptNumeral: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "manuscriptNumeral", label: "Manuscript numeral", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return { quantity: manuscriptRoman(i.manuscriptNumeral) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { manuscriptNumeral: "iiij" },
  output: { result: { quantity: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleography/roman-numeral-manuscript-parser",
  title: "Roman Numeral Manuscript Quantity Parser (iiij style)",
  description:
    "Bounded medieval additive Roman numeral branch, final j as i, conventional subtractive groups; does not infer overbars or nonstandard multiplicative notations.",
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
