import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  start: number;
  stopExclusive: number;
  stride: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "Start", kind: "integer" },
  { id: "stopExclusive", label: "Stop exclusive", kind: "integer" },
  { id: "stride", label: "Stride", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.start, 0, 1000000);
  H.int(i.stopExclusive, 0, 1000000);
  H.int(i.stride, 1, 1000000);
  const count = Math.max(0, Math.ceil((i.stopExclusive - i.start) / i.stride));
  return H.finish({
    count,
    lastIndex: count === 0 ? -1 : i.start + (count - 1) * i.stride,
  });
};
export const example = {
  input: { start: 2, stopExclusive: 10, stride: 3 },
  output: { result: { count: 3, lastIndex: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-stride-last-valid-index",
  title: "List: List Stride Last Valid Index Tool",
  description:
    "Plan a positive-stride bounded index run, retaining -1 for its empty last-index sentinel instead of enumerating a list.",
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
          count: { type: "number" },
          lastIndex: { type: "number" },
        },
        required: ["count", "lastIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
