import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ notation: string; size: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "notation", kind: "string", label: "notation" },
  { id: "size", kind: "integer", label: "size" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.size, 0, 128);
  H.check(/^(?:\s*\((?:\d+(?:\s+\d+)*)?\)\s*)*$/.test(i.notation));
  const cycles = [...i.notation.matchAll(/\(([^)]*)\)/g)].map((m) =>
    m[1].trim() ? m[1].trim().split(/\s+/).map(Number) : [],
  );
  const used = cycles.flat();
  used.forEach((x) => H.int(x, 0, i.size - 1));
  H.check(H.unique(used).length === used.length);
  const permutation = Array.from({ length: i.size }, (_, j) => j);
  for (const c of cycles)
    c.forEach((x, j) => (permutation[x] = c[(j + 1) % c.length]));
  return H.finish({ permutation });
};
export const example = {
  input: { notation: "(0 2 1)(3)", size: 4 },
  output: { result: { permutation: [2, 0, 1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/permutation-cycle-notation-parser",
  title: "Permutation Cycle Notation Parser",
  description:
    "Parse zero-based disjoint cycle notation on an explicit index universe; overlapping cycles are rejected instead of interpreted as cycle products.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
