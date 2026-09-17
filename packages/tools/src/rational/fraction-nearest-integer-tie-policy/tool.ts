import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  numerator: string;
  denominator: string;
  ties: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numerator", kind: "string", label: "numerator" },
  { id: "denominator", kind: "string", label: "denominator" },
  { id: "ties", kind: "string", label: "ties" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [n, d] = H.fracInput(i.numerator, i.denominator);
  H.check(["even", "away", "positive"].includes(i.ties));
  const lo = H.floor(n, d),
    r = n - lo * d;
  let nearest = 2n * r < d ? lo : lo + 1n;
  if (2n * r === d)
    nearest =
      i.ties === "even"
        ? lo % 2n === 0n
          ? lo
          : lo + 1n
        : i.ties === "away"
          ? n < 0n
            ? lo
            : lo + 1n
          : lo + 1n;
  return H.finish({ integer: String(nearest), tie: 2n * r === d });
};
export const example = {
  input: { numerator: "-5", denominator: "2", ties: "even" },
  output: { result: { integer: "-2", tie: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-nearest-integer-tie-policy",
  title: "Fraction Nearest Integer Tie Policy",
  description:
    "Round an exact fraction to a nearest integer with explicit half-even, away-from-zero or positive-infinity tie policy.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
