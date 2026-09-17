import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  numerator: string;
  denominator: string;
  base: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numerator", kind: "string", label: "numerator" },
  { id: "denominator", kind: "string", label: "denominator" },
  { id: "base", kind: "integer", label: "base" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [n, d] = H.fracInput(i.numerator, i.denominator);
  H.int(i.base, 2, 36);
  let rest = d;
  while (true) {
    const g = H.gcd(rest, BigInt(i.base));
    if (g === 1n) break;
    rest /= g;
  }
  return H.finish({ terminates: rest === 1n });
};
export const example = {
  input: { numerator: "1", denominator: "8", base: 2 },
  output: { result: { terminates: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-base-termination-check",
  title: "Fraction Base Termination Check",
  description:
    "Check exact rational termination in an explicit integer radix 2\u201336 by removing denominator factors shared with that radix.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
