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
  const properties = H.relationProperties(p, i.universe);
  return H.finish({
    properties,
    holds:
      properties.reflexive && properties.antisymmetric && properties.transitive,
  });
};
export const example = {
  input: { pairsJson: '[["a","b"],["b","a"]]', universe: ["a", "b"] },
  output: {
    result: {
      properties: {
        reflexive: false,
        symmetric: true,
        antisymmetric: false,
        transitive: false,
      },
      holds: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/relation-partial-order-property-report",
  title: "Finite Relation Partial Order Property Report",
  description:
    "Report partial-order property evidence for an explicit finite relation; does not assume a claimed order or repair missing pairs.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
