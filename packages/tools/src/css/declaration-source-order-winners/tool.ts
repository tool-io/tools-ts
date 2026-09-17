import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.declarations(i.text);
  return H.finish({
    winners: H.groups(r, (v) => v.name).map((g) => {
      const important = g.indexes.filter((j) => r[j].important),
        indexes = important.length ? important : g.indexes;
      const index = indexes.at(-1)!;
      return { ...r[index], index };
    }),
  });
};
export const example = {
  input: { text: "a:1!important;a:2" },
  output: {
    result: {
      winners: [
        { name: "a", value: "1", important: true, start: 0, end: 13, index: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/declaration-source-order-winners",
  title: "CSS Declaration Source Order Winners",
  description:
    "Select important-aware last declarations within one declaration list; no selector specificity, origin/layer cascade, shorthand expansion or value validity model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
