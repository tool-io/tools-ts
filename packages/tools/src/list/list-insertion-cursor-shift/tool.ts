import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  cursor: number;
  insertionIndex: number;
  insertedCount: number;
  length: number;
  affinity: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cursor", label: "Cursor", kind: "integer" },
  { id: "insertionIndex", label: "Insertion index", kind: "integer" },
  { id: "insertedCount", label: "Inserted count", kind: "integer" },
  { id: "length", label: "Length", kind: "integer" },
  {
    id: "affinity",
    label: "Affinity",
    kind: "string",
    enum: ["before", "after"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 1000000);
  H.int(i.cursor, 0, i.length);
  H.int(i.insertionIndex, 0, i.length);
  H.int(i.insertedCount, 0, 1000000);
  H.choice(i.affinity, ["before", "after"]);
  return H.finish({
    cursor:
      i.cursor > i.insertionIndex ||
      (i.cursor === i.insertionIndex && i.affinity === "after")
        ? i.cursor + i.insertedCount
        : i.cursor,
    newLength: i.length + i.insertedCount,
  });
};
export const example = {
  input: {
    cursor: 2,
    insertionIndex: 2,
    insertedCount: 3,
    length: 5,
    affinity: "after",
  },
  output: { result: { cursor: 5, newLength: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-insertion-cursor-shift",
  title: "List: List Insertion Cursor Shift Tool",
  description:
    "Map a between-element cursor through one insertion with an explicit before/after affinity at the insertion point.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cursor: { type: "number" },
          newLength: { type: "number" },
        },
        required: ["cursor", "newLength"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
