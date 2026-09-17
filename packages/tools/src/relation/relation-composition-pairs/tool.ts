import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  firstJson: string;
  secondJson: string;
  universe: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstJson", kind: "string", label: "firstJson" },
  { id: "secondJson", kind: "string", label: "secondJson" },
  { id: "universe", kind: "stringList", label: "universe" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.relation(i.firstJson, i.universe),
    q = H.relation(i.secondJson, i.universe);
  const pairs: string[][] = [];
  for (const [a, b] of p)
    for (const [c, d] of q)
      if (b === c && !H.hasPair(pairs, a, d)) pairs.push([a, d]);
  return H.finish({ pairs });
};
export const example = {
  input: {
    firstJson: '[["a","b"]]',
    secondJson: '[["b","c"]]',
    universe: ["a", "b", "c"],
  },
  output: { result: { pairs: [["a", "c"]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/relation-composition-pairs",
  title: "Finite Relation Composition Pairs",
  description:
    "Compose finite relations by following first then second, coalescing duplicate witnesses into unique endpoint pairs; order convention is explicit.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
