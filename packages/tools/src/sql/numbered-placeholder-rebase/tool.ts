import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ indexes: readonly number[]; offset: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "indexes", label: "indexes", kind: "numberList" },
  { id: "offset", label: "offset", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.offset, -1e6, 1e6);
  i.indexes.forEach((x) => H.int(x, 1, 1e6));
  return H.finish({
    indexes: i.indexes.map((x) => H.int(x + i.offset, 1, 1e6)),
  });
};
export const example = {
  input: { indexes: [1, 3, 3], offset: 2 },
  output: { result: { indexes: [3, 5, 5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["SQL Numbered Placeholder Rebase", "SQL", "database development"],
    collections: ["encode-decode"],
    fields: ["SQL", "database development"],
    keywords: ["SQL", "database development"],
  },
  id: "sql/numbered-placeholder-rebase",
  title: "SQL Numbered Placeholder Rebase",
  description:
    "Rebase explicit numbered SQL placeholder occurrences by a signed integer offset, rejecting invalid resulting indexes; no SQL text rewriting.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { indexes: { type: "array", items: { type: "number" } } },
        required: ["indexes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
