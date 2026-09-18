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
    records: H.groups(r, (v) => JSON.stringify([v.section, v.name])).map(
      (g) => {
        const index = g.indexes[0];
        return { ...r[index], index };
      },
    ),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section":"a","name":"x","value":"1"},{"section":"a","name":"x","value":"2"},{"section":"b","name":"x","value":"3"}]',
  },
  output: {
    result: {
      records: [
        { section: "a", name: "x", value: "1", index: 0 },
        { section: "b", name: "x", value: "3", index: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/section-key-first-wins",
  title: "INI Section Key First Wins",
  description:
    "Resolve explicit INI section/key observations under case-sensitive first-wins policy, preserving winner indexes and separate section identity.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
