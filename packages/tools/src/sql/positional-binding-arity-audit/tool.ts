import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  placeholderCount: number;
  bindingCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "placeholderCount", label: "placeholderCount", kind: "integer" },
  { id: "bindingCount", label: "bindingCount", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.placeholderCount);
  H.int(i.bindingCount);
  return H.finish({
    matches: i.placeholderCount === i.bindingCount,
    difference: i.bindingCount - i.placeholderCount,
  });
};
export const example = {
  input: { placeholderCount: 3, bindingCount: 2 },
  output: { result: { matches: false, difference: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SQL Positional Binding Arity Audit",
      "SQL",
      "database development",
    ],
    collections: ["encode-decode"],
    fields: ["SQL", "database development"],
    keywords: ["SQL", "database development"],
  },
  id: "sql/positional-binding-arity-audit",
  title: "SQL Positional Binding Arity Audit",
  description:
    "Compare explicitly supplied positional SQL placeholder and binding counts with signed discrepancy; no query-source lexing or driver binding semantics.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matches: { type: "boolean" },
          difference: { type: "number" },
        },
        required: ["matches", "difference"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
