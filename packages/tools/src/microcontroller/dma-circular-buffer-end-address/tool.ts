import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  baseAddress: string;
  elementCount: number;
  elementBytes: number;
  addressBits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "baseAddress", label: "Base address", kind: "string" },
  { id: "elementCount", label: "Element count", kind: "integer" },
  { id: "elementBytes", label: "Element bytes", kind: "integer" },
  { id: "addressBits", label: "Address bits", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.elementCount, 0, 1000000000);
  H.int(i.elementBytes, 1, 128);
  const base = H.word(i.baseAddress, i.addressBits),
    end = base + BigInt(i.elementCount) * BigInt(i.elementBytes);
  H.check(end <= 2n ** BigInt(i.addressBits));
  return H.finish({
    endExclusive: String(end),
    lastByteAddress: i.elementCount === 0 ? String(base) : String(end - 1n),
    empty: i.elementCount === 0,
  });
};
export const example = {
  input: {
    baseAddress: "100",
    elementCount: 4,
    elementBytes: 2,
    addressBits: 16,
  },
  output: {
    result: { endExclusive: "108", lastByteAddress: "107", empty: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/dma-circular-buffer-end-address",
  title: "Microcontroller: DMA Circular Buffer End Address Tool",
  description:
    "Compute exact half-open DMA buffer end and last used byte from explicit geometry, rejecting address-space overflow; empty buffers use base as unused last-byte witness.",
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
          empty: { type: "boolean" },
          endExclusive: { type: "string" },
          lastByteAddress: { type: "string" },
        },
        required: ["empty", "endExclusive", "lastByteAddress"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
