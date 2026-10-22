import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  indexes: readonly number[];
  bindingCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "indexes", label: "indexes", kind: "numberList" },
  { id: "bindingCount", label: "bindingCount", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.bindingCount, 0, 128);
  return H.finish({
    bindingIndexes: i.indexes.map((x) => {
      H.int(x, 1, i.bindingCount);
      return x - 1;
    }),
    unused: Array.from({ length: i.bindingCount }, (_, j) => j).filter(
      (j) => !i.indexes.includes(j + 1),
    ),
  });
};
export const example = {
  input: { indexes: [2, 1, 2], bindingCount: 3 },
  output: { result: { bindingIndexes: [1, 0, 1], unused: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SQL Placeholder Occurrence Binding Map",
      "SQL",
      "database development",
    ],
    collections: ["encode-decode"],
    fields: ["SQL", "database development"],
    keywords: ["SQL", "database development"],
  },
  id: "sql/placeholder-occurrence-binding-map",
  title: "SQL Placeholder Occurrence Binding Map",
  description:
    "Map explicit one-based numbered placeholder occurrences to zero-based binding slots and unused slots; repeated references intentionally reuse a binding.",
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
          bindingIndexes: { type: "array", items: { type: "number" } },
          unused: { type: "array", items: { type: "number" } },
        },
        required: ["bindingIndexes", "unused"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
