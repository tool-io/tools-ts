import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  cursor: number;
  deletionStart: number;
  deletionEnd: number;
  length: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cursor", label: "Cursor", kind: "integer" },
  { id: "deletionStart", label: "Deletion start", kind: "integer" },
  { id: "deletionEnd", label: "Deletion end", kind: "integer" },
  { id: "length", label: "Length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 1000000);
  H.int(i.cursor, 0, i.length);
  H.int(i.deletionStart, 0, i.length);
  H.int(i.deletionEnd, i.deletionStart, i.length);
  return H.finish({
    cursor:
      i.cursor <= i.deletionStart
        ? i.cursor
        : i.cursor <= i.deletionEnd
          ? i.deletionStart
          : i.cursor - (i.deletionEnd - i.deletionStart),
    newLength: i.length - (i.deletionEnd - i.deletionStart),
  });
};
export const example = {
  input: { cursor: 3, deletionStart: 2, deletionEnd: 4, length: 5 },
  output: { result: { cursor: 2, newLength: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-deletion-cursor-shift",
  title: "List: List Deletion Cursor Shift Tool",
  description:
    "Map one between-element cursor through a half-open deletion, collapsing cursors inside the removed run to its start.",
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
