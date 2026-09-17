import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ permutation: readonly number[]; start: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "permutation", kind: "numberList", label: "permutation" },
  { id: "start", kind: "integer", label: "start" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.permutation(i.permutation);
  H.int(i.start, 0, i.permutation.length - 1);
  const orbit: number[] = [];
  let p = i.start;
  do {
    orbit.push(p);
    p = i.permutation[p];
  } while (p !== i.start);
  return H.finish({ orbit });
};
export const example = {
  input: { permutation: [1, 2, 0], start: 1 },
  output: { result: { orbit: [1, 2, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-orbit",
  title: "Index Permutation Orbit",
  description:
    "Return the orbit of an explicit index under a validated permutation, starting at the requested index and omitting the repeated closure.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
