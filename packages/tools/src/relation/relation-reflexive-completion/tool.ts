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
  const pairs = [...p];
  for (const r of i.universe.map((x) => [x, x] as [string, string]))
    if (!H.hasPair(pairs, r[0], r[1])) pairs.push(r);
  return H.finish({ pairs });
};
export const example = {
  input: { pairsJson: '[["a","b"],["b","a"]]', universe: ["a", "b"] },
  output: {
    result: {
      pairs: [
        ["a", "b"],
        ["b", "a"],
        ["a", "a"],
        ["b", "b"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/relation-reflexive-completion",
  title: "Finite Relation Reflexive Completion",
  description:
    "Construct the least reflexive completion of an explicit finite relation; no transitive closure is performed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
