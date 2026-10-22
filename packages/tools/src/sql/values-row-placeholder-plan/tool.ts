import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ rows: number; columns: number; first: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
  { id: "first", label: "first", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.rows, 0, 128);
  H.int(i.columns, 1, 128);
  H.int(i.first, 1, 1e6);
  H.check(i.rows * i.columns <= 128);
  return H.finish({
    rows: Array.from({ length: i.rows }, (_, r) =>
      Array.from(
        { length: i.columns },
        (_, c) => "$" + (i.first + r * i.columns + c),
      ),
    ),
    next: i.first + i.rows * i.columns,
  });
};
export const example = {
  input: { rows: 2, columns: 2, first: 3 },
  output: {
    result: {
      rows: [
        ["$3", "$4"],
        ["$5", "$6"],
      ],
      next: 7,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["SQL Values Row Placeholder Plan", "SQL", "database development"],
    collections: ["encode-decode"],
    fields: ["SQL", "database development"],
    keywords: ["SQL", "database development"],
  },
  id: "sql/values-row-placeholder-plan",
  title: "SQL Values Row Placeholder Plan",
  description:
    "Plan a row-major VALUES placeholder grid with monotonically numbered $N tokens and next index; only placeholders, never interpolated caller SQL values.",
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
          rows: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
          },
          next: { type: "number" },
        },
        required: ["rows", "next"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
