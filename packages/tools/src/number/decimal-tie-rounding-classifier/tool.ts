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
    class:
      rem === 0n
        ? "exact"
        : 2n * rem < den
          ? "below-half"
          : 2n * rem === den
            ? "tie"
            : "above-half",
  });
};
export const example = {
  input: { value: "0.25", quantum: "0.1" },
  output: { result: { class: "tie" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-tie-rounding-classifier",
  title: "Decimal Tie Rounding Classifier",
  description:
    "Exact decimal quantum half-tie classification; signed arithmetic uses floor rather than truncation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
