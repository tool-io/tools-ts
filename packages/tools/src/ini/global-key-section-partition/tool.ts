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
    global: r.filter((v) => v.section === ""),
    sectioned: r.filter((v) => v.section !== ""),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section": "", "name": "x", "value": "1"}, {"section": "b", "name": "x", "value": "3"}]',
  },
  output: {
    result: {
      global: [{ section: "", name: "x", value: "1" }],
      sectioned: [{ section: "b", name: "x", value: "3" }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/global-key-section-partition",
  title: "INI Global Key Section Partition",
  description:
    "Partition explicit INI key observations between the unsectioned global namespace and named sections; preserves original records, duplicates and empty values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
