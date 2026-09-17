import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  pairsJson: string;
  universe: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pairsJson", kind: "string", label: "pairsJson" },
  { id: "universe", kind: "stringList", label: "universe" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.relation(i.pairsJson, i.universe);
  const q = H.relationProperties(p, i.universe);
  H.check(
    q.reflexive && q.antisymmetric && q.transitive,
    "A partial order is required",
  );
  return H.finish({
    minimal: i.universe.filter((x) => !p.some(([a, b]) => b === x && a !== x)),
    maximal: i.universe.filter((x) => !p.some(([a, b]) => a === x && b !== x)),
  });
};
export const example = {
  input: { pairsJson: '[["a","a"],["b","b"],["a","b"]]', universe: ["a", "b"] },
  output: { result: { minimal: ["a"], maximal: ["b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/relation-order-minimal-maximal-elements",
  title: "Finite Relation Minimal Maximal Elements",
  description:
    "Return all minimal and maximal elements only after validating a supplied finite partial order; these need not be a unique least/greatest element.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
