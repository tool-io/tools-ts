import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ numerator: string; denominator: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numerator", kind: "string", label: "numerator" },
  { id: "denominator", kind: "string", label: "denominator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [n, d] = H.fracInput(i.numerator, i.denominator);
  return H.finish(H.fraction(n, d));
};
export const example = {
  input: { numerator: "-4", denominator: "-6" },
  output: { result: { numerator: "2", denominator: "3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-canonical-pair",
  title: "Canonical Fraction Pair",
  description:
    "Canonicalize an exact integer fraction into coprime numerator and positive denominator text; zero denominator is rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
