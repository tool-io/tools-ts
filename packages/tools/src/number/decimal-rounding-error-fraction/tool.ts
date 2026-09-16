import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ value: string; quantum: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", kind: "string", label: "value" },
  { id: "quantum", kind: "string", label: "quantum" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [v, vd] = H.decimalFraction(i.value),
    [q, qd] = H.decimalFraction(i.quantum);
  H.check(q > 0n);
  const num = v * qd,
    den = vd * q,
    lo = H.floor(num, den),
    rem = num - lo * den;
  return H.finish({
    rounded: H.fraction((2n * rem < den ? lo : lo + 1n) * q, qd),
    error: H.fraction(
      (2n * rem < den ? lo : lo + 1n) * q * vd - v * qd,
      qd * vd,
    ),
  });
};
export const example = {
  input: { value: "0.25", quantum: "0.1" },
  output: {
    result: {
      rounded: { numerator: "3", denominator: "10" },
      error: { numerator: "1", denominator: "20" },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-rounding-error-fraction",
  title: "Decimal Rounding Error Fraction",
  description:
    "Exact decimal quantum rounding error with ties toward positive infinity; signed arithmetic uses floor rather than truncation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
