import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ attributesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "attributesJson", kind: "string", label: "attributesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.attributes(i.attributesJson),
    keep = r.flatMap((v, j) =>
      r.slice(j + 1).every((x) => x.name !== v.name) ? [j] : [],
    );
  return H.finish({
    attributes: keep.map((j) => ({ ...r[j], sourceIndex: j })),
  });
};
export const example = {
  input: {
    attributesJson:
      '[{"name":"ID","value":"a"},{"name":"id","value":"b"},{"name":"class","value":"c"}]',
  },
  output: {
    result: {
      attributes: [
        { name: "id", value: "b", sourceIndex: 1 },
        { name: "class", value: "c", sourceIndex: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/attribute-occurrence-last-wins",
  title: "HTML Attribute Occurrence Last Wins",
  description:
    "Apply an explicit last-occurrence-wins policy to supplied HTML attribute observations, preserving winning source indexes; browsers\u2019 tokenizer normally uses first wins instead.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
