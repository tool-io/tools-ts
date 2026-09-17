import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  numerator: string;
  denominator: string;
  minimum: string;
  maximum: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numerator", kind: "string", label: "numerator" },
  { id: "denominator", kind: "string", label: "denominator" },
  { id: "minimum", kind: "string", label: "minimum" },
  { id: "maximum", kind: "string", label: "maximum" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [n, d] = H.fracInput(i.numerator, i.denominator);
  const min = H.bigint(i.minimum),
    max = H.bigint(i.maximum);
  H.check(max >= min);
  return H.finish({ inside: n >= min * d && n <= max * d });
};
export const example = {
  input: { numerator: "5", denominator: "2", minimum: "2", maximum: "3" },
  output: { result: { inside: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-between-integer-bounds",
  title: "Fraction Between Integer Bounds",
  description:
    "Check exact rational membership in caller-supplied inclusive integer bounds without decimal approximation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
