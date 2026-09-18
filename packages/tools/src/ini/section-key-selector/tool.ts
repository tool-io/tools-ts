import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  recordsJson: string;
  section: string;
  keys: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
  { id: "section", label: "section", kind: "string" },
  { id: "keys", label: "keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.iniRecords(i.recordsJson);
  return H.finish({
    records: r.flatMap((v, index) =>
      v.section === i.section && i.keys.includes(v.name)
        ? [{ ...v, index }]
        : [],
    ),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section":"a","name":"x","value":"1"},{"section":"a","name":"x","value":"2"},{"section":"b","name":"x","value":"3"}]',
    section: "a",
    keys: ["x"],
  },
  output: {
    result: {
      records: [
        { section: "a", name: "x", value: "1", index: 0 },
        { section: "a", name: "x", value: "2", index: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/section-key-selector",
  title: "INI Section Key Selector",
  description:
    "Select every explicit INI observation matching an exact section and key bank, preserving duplicates and occurrence provenance rather than choosing a winner.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
