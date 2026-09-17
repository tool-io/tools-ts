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
  const tokens = H.unique(H.classTokens(i.references));
  return H.finish({
    references: tokens.map((id) => ({
      id,
      matches: i.ids.flatMap((x, j) => (x === id ? [j] : [])),
    })),
    ambiguous: tokens.filter((id) => i.ids.filter((x) => x === id).length > 1),
  });
};
export const example = {
  input: { references: "a b", ids: ["a", "a", "c"] },
  output: {
    result: {
      references: [
        { id: "a", matches: [0, 1] },
        { id: "b", matches: [] },
      ],
      ambiguous: ["a"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/id-reference-ambiguity-audit",
  title: "HTML ID Reference Ambiguity Audit",
  description:
    "Inventory all supplied document ID positions matching each explicit ID-reference token and identify ambiguity instead of arbitrarily choosing the first element.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
