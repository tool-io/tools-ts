import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ start: number; end: number; length: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "Start", kind: "integer" },
  { id: "end", label: "End", kind: "integer" },
  { id: "length", label: "Length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 1000000);
  H.int(i.start, 0, i.length);
  H.int(i.end, 0, i.length);
  return H.finish({ sliceLength: Math.max(0, i.end - i.start) });
};
export const example = {
  input: { start: 2, end: 5, length: 8 },
  output: { result: { sliceLength: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-half-open-slice-length",
  title: "List: List Half Open Slice Length Tool",
  description:
    "Return length of an already normalized nonnegative half-open slice bounded by an explicit list length; reversed endpoints denote an empty slice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { sliceLength: { type: "number" } },
        required: ["sliceLength"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
