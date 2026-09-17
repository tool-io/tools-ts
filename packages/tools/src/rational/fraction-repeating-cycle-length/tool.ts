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
  H.check(d <= 10000n, "Denominator budget is 10000");
  let rem = ((n % d) + d) % d,
    index = 0;
  const seen = new Map<bigint, number>();
  while (rem !== 0n && !seen.has(rem)) {
    seen.set(rem, index++);
    rem = (rem * 10n) % d;
  }
  return H.finish({
    cycleLength: rem === 0n ? 0 : index - seen.get(rem)!,
    nonrepeatingDigits: rem === 0n ? index : seen.get(rem)!,
  });
};
export const example = {
  input: { numerator: "1", denominator: "6" },
  output: { result: { cycleLength: 1, nonrepeatingDigits: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-repeating-cycle-length",
  title: "Fraction Repeating Cycle Length",
  description:
    "Trace the exact base-ten remainder cycle of a fraction with reduced denominator at most 10000; terminating fractions have zero repeating cycle length.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
