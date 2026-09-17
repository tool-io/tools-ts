import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  pairsJson: string;
  domain: readonly string[];
  codomain: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pairsJson", kind: "string", label: "pairsJson" },
  { id: "domain", kind: "stringList", label: "domain" },
  { id: "codomain", kind: "stringList", label: "codomain" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.relation(i.pairsJson, i.domain, i.codomain),
    witnesses = i.domain.filter(
      (a) => H.unique(p.filter((r) => r[0] === a).map((r) => r[1])).length > 1,
    );
  return H.finish({ holds: witnesses.length === 0, witnesses });
};
export const example = {
  input: {
    pairsJson: '[["a","x"],["b","y"]]',
    domain: ["a", "b"],
    codomain: ["x", "y"],
  },
  output: { result: { holds: true, witnesses: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/relation-functionality-audit",
  title: "Finite Relation Functionality Audit",
  description:
    "Audit finite relation right-uniqueness (partial functionality); functionality does not require totality.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
