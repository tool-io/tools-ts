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
  const witnesses = i.universe
    .filter((x) => !H.hasPair(p, x, x))
    .map((x) => [x, x]);
  return H.finish({ holds: witnesses.length === 0, witnesses });
};
export const example = {
  input: { pairsJson: '[["a","b"],["b","a"]]', universe: ["a", "b"] },
  output: {
    result: {
      holds: false,
      witnesses: [
        ["a", "a"],
        ["b", "b"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/reflexive-diagonal-audit",
  title: "Finite Relation Reflexive Diagonal Audit",
  description:
    "Audit finite relation reflexivity and return explicit failing witnesses; unknown universe elements are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
