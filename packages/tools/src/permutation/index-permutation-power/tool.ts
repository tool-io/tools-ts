import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  permutation: readonly number[];
  exponent: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "permutation", kind: "numberList", label: "permutation" },
  { id: "exponent", kind: "string", label: "exponent" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const cycles = H.cycles(i.permutation),
    power = H.bigint(i.exponent),
    p = i.permutation.map(() => 0);
  for (const c of cycles) {
    const n = BigInt(c.length),
      offset = Number(((power % n) + n) % n);
    c.forEach((x, j) => (p[x] = c[(j + offset) % c.length]));
  }
  return H.finish({ permutation: p });
};
export const example = {
  input: { permutation: [1, 2, 0], exponent: "-1" },
  output: { result: { permutation: [2, 0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-power",
  title: "Index Permutation Integer Power",
  description:
    "Raise an index permutation to an exact signed integer power by cycle offsets, including negative inverse powers and zero identity.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
