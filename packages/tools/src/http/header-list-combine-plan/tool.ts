import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  headersJson: string;
  combinableNames: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headersJson", label: "headersJson", kind: "string" },
  { id: "combinableNames", label: "combinableNames", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.headerPairs(i.headersJson);
  i.combinableNames.forEach((s) => H.check(H.token(s)));
  return H.finish({
    plan: H.groups(r, (v) => v.name.toLowerCase()).map((g) => ({
      name: g.key,
      indexes: g.indexes,
      combined:
        i.combinableNames.map((x) => x.toLowerCase()).includes(g.key) &&
        g.key !== "set-cookie"
          ? g.indexes.map((j) => r[j].value).join(", ")
          : null,
    })),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
    combinableNames: ["x-a", "set-cookie"],
  },
  output: {
    result: {
      plan: [
        { name: "x-a", indexes: [0, 1], combined: "one, two" },
        { name: "set-cookie", indexes: [2], combined: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-list-combine-plan",
  title: "HTTP Header List Combination Plan",
  description:
    "Plan comma combination only for explicit caller-qualified list fields, always preserving Set-Cookie as uncombined; no universal field-combination inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
