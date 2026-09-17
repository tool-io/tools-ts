import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ occurrencesJson: string; policy: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "occurrencesJson", label: "occurrencesJson", kind: "string" },
  { id: "policy", label: "policy", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(["first", "last", "all", "reject"].includes(i.policy));
  const r = H.records(i.occurrencesJson).map((v) => ({
    name: H.str(v.name),
    value: H.str(v.value),
  }));
  return H.finish({
    records: H.groups(r, (v) => v.name).map((g) => {
      H.check(i.policy !== "reject" || g.indexes.length === 1);
      const indexes =
        i.policy === "all"
          ? g.indexes
          : [i.policy === "first" ? g.indexes[0] : g.indexes.at(-1)!];
      return {
        name: g.key,
        values: indexes.map((j) => r[j].value),
        sourceIndexes: indexes,
      };
    }),
  });
};
export const example = {
  input: {
    occurrencesJson: '[{"name":"x","value":"1"},{"name":"x","value":"2"}]',
    policy: "last",
  },
  output: {
    result: { records: [{ name: "x", values: ["2"], sourceIndexes: [1] }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/option-duplicate-policy-resolver",
  title: "Option Duplicate Policy Resolver",
  description:
    "Resolve explicit option duplicate occurrences under first/last/all/reject policy, retaining winning source indexes; not command-line token parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
