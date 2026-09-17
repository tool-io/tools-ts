import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ references: string; ids: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "references", kind: "string", label: "references" },
  { id: "ids", kind: "stringList", label: "ids" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const tokens = H.classTokens(i.references);
  return H.finish({
    tokens,
    missing: H.unique(tokens.filter((x) => !i.ids.includes(x))),
    duplicates: H.duplicates(tokens, (x) => x),
  });
};
export const example = {
  input: { references: "a b a", ids: ["a"] },
  output: {
    result: {
      tokens: ["a", "b", "a"],
      missing: ["b"],
      duplicates: [{ key: "a", indexes: [0, 2] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/id-reference-token-coverage",
  title: "HTML ID Reference Token Coverage",
  description:
    "Audit an explicit HTML ID-reference token list against supplied document IDs, retaining unknown references and repeated tokens; not DOM traversal or an accessibility certification.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
