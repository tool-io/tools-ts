import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  length: number;
  start: number;
  deleteCount: number;
  insertCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", label: "Length", kind: "integer" },
  { id: "start", label: "Start", kind: "integer" },
  { id: "deleteCount", label: "Delete count", kind: "integer" },
  { id: "insertCount", label: "Insert count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 1000000);
  H.int(i.start, 0, i.length);
  H.int(i.deleteCount, 0, 1000000);
  H.int(i.insertCount, 0, 1000000);
  const actualDelete = Math.min(i.deleteCount, i.length - i.start);
  return H.finish({
    newLength: i.length - actualDelete + i.insertCount,
    lengthDelta: i.insertCount - actualDelete,
    actualDeleteCount: actualDelete,
  });
};
export const example = {
  input: { length: 5, start: 4, deleteCount: 3, insertCount: 2 },
  output: { result: { newLength: 6, lengthDelta: 1, actualDeleteCount: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-single-splice-length-delta",
  title: "List: List Single Splice Length Delta Tool",
  description:
    "Compute one splice length delta with nonnegative start and deletion clipped at the list end; no mutation of list contents.",
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
          actualDeleteCount: { type: "number" },
          lengthDelta: { type: "number" },
          newLength: { type: "number" },
        },
        required: ["actualDeleteCount", "lengthDelta", "newLength"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
