import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.iniRecords(i.recordsJson);
  return H.finish({
    collisions: H.groups(r, (v) =>
      JSON.stringify([v.section.toLowerCase(), v.name.toLowerCase()]),
    ).filter(
      (g) =>
        H.unique(
          g.indexes.map((j) => JSON.stringify([r[j].section, r[j].name])),
        ).length > 1,
    ),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section":"a","name":"X","value":"1"},{"section":"A","name":"x","value":"2"}]',
  },
  output: { result: { collisions: [{ key: '["a","x"]', indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/section-key-case-collision",
  title: "INI Section Key Case Collision Audit",
  description:
    "Audit INI section/key spelling collisions under an explicit JavaScript lowercase policy, distinct from repeated identical spellings; not a universal INI case rule.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
