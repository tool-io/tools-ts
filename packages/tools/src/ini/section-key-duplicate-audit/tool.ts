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
    duplicates: H.duplicates(r, (v) => JSON.stringify([v.section, v.name])),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section":"a","name":"x","value":"1"},{"section":"a","name":"x","value":"2"},{"section":"b","name":"x","value":"3"}]',
  },
  output: { result: { duplicates: [{ key: '["a","x"]', indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/section-key-duplicate-audit",
  title: "INI Section Key Duplicate Audit",
  description:
    "Audit exact INI section/key duplicate observations without conflating equal key names in different sections; case-sensitive explicit-record dialect.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
