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
  return H.finish({ member: rem === 0n });
};
export const example = {
  input: { value: "0.25", quantum: "0.1" },
  output: { result: { member: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-quantum-membership",
  title: "Decimal Quantum Membership",
  description:
    "Exact decimal quantum membership; signed arithmetic uses floor rather than truncation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
