import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byteCount: number; bytesPerElement: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byteCount", label: "Byte count", kind: "integer" },
  { id: "bytesPerElement", label: "Bytes per element", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byteCount, 0, 1000000000);
  H.int(i.bytesPerElement, 1, 128);
  return H.finish({
    completeElements: Math.floor(i.byteCount / i.bytesPerElement),
    remainingBytes: i.byteCount % i.bytesPerElement,
    exactElementCount: i.byteCount % i.bytesPerElement === 0,
  });
};
export const example = {
  input: { byteCount: 10, bytesPerElement: 4 },
  output: {
    result: {
      completeElements: 2,
      remainingBytes: 2,
      exactElementCount: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/dma-element-count-vs-byte-count",
  title: "Microcontroller: DMA Element Count Vs Byte Count Tool",
  description:
    "Crosswalk a DMA byte budget to complete fixed-size elements while retaining remainder evidence rather than truncating silently.",
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
          completeElements: { type: "number" },
          exactElementCount: { type: "boolean" },
          remainingBytes: { type: "number" },
        },
        required: ["completeElements", "exactElementCount", "remainingBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
