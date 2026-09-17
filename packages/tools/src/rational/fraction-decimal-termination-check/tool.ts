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
  let rest = d,
    twos = 0,
    fives = 0;
  while (rest % 2n === 0n) {
    rest /= 2n;
    twos++;
  }
  while (rest % 5n === 0n) {
    rest /= 5n;
    fives++;
  }
  return H.finish({ terminates: rest === 1n });
};
export const example = {
  input: { numerator: "7", denominator: "40" },
  output: { result: { terminates: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-decimal-termination-check",
  title: "Fraction Decimal Termination Check",
  description:
    "Report exact canonical fraction base-ten termination from reduced denominator factors, not approximate decimal expansion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
