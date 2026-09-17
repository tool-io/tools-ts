import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ pattern: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pattern", label: "pattern", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const f = H.floatFields(i.pattern, 32);
  H.check(f.kind !== "nan" && f.kind !== "infinity");
  const sign = 1n << 31n,
    max = 2139095039n;
  let up: bigint | null, down: bigint | null;
  if ((f.bits & (sign - 1n)) === 0n) {
    up = 1n;
    down = sign + 1n;
  } else if (f.sign) {
    up = f.bits - 1n;
    down = f.bits === sign + max ? null : f.bits + 1n;
  } else {
    up = f.bits === max ? null : f.bits + 1n;
    down = f.bits - 1n;
  }
  return H.finish({
    nextUp: up === null ? null : String(up),
    nextDown: down === null ? null : String(down),
  });
};
export const example = {
  input: { pattern: "1065353216" },
  output: { result: { nextUp: "1065353217", nextDown: "1065353215" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "float/binary32-adjacent-finite-patterns",
  title: "IEEE Binary32 Adjacent Finite Patterns",
  description:
    "Return adjacent finite binary32 raw value patterns toward positive/negative infinity; signed zeros skip the equivalent other zero and extrema return null instead of infinity.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
