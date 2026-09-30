import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ addressOffset: number; pageSize: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "addressOffset", label: "Address offset", kind: "integer" },
  { id: "pageSize", label: "Page size", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.addressOffset, 0, 0xffffffff);
  H.int(i.pageSize, 1, 1048576);
  return H.finish({
    pageIndex: Math.floor(i.addressOffset / i.pageSize),
    offsetWithinPage: i.addressOffset % i.pageSize,
  });
};
export const example = {
  input: { addressOffset: 513, pageSize: 256 },
  output: { result: { pageIndex: 2, offsetWithinPage: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/flash-page-offset-field",
  title: "Microcontroller: Flash Page Offset Field Tool",
  description:
    "Split an explicit region-relative flash offset into page index and within-page byte offset; not a device geometry lookup or erase-safety check.",
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
          offsetWithinPage: { type: "number" },
          pageIndex: { type: "number" },
        },
        required: ["offsetWithinPage", "pageIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
