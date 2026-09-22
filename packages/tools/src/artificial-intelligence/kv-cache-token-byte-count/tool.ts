import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  tokens: number;
  layers: number;
  kvHeads: number;
  headDimension: number;
  bytesPerValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tokens", label: "Tokens", kind: "integer" },
  { id: "layers", label: "Layers", kind: "integer" },
  { id: "kvHeads", label: "Kv heads", kind: "integer" },
  { id: "headDimension", label: "Head dimension", kind: "integer" },
  { id: "bytesPerValue", label: "Bytes per value", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.tokens, 0, 1000000000);
  [i.layers, i.kvHeads, i.headDimension, i.bytesPerValue].forEach((x) =>
    H.int(x, 1, 1000000),
  );
  return H.finish({
    cacheBytes: String(
      2n *
        BigInt(i.tokens) *
        BigInt(i.layers) *
        BigInt(i.kvHeads) *
        BigInt(i.headDimension) *
        BigInt(i.bytesPerValue),
    ),
  });
};
export const example = {
  input: {
    tokens: 10,
    layers: 2,
    kvHeads: 4,
    headDimension: 8,
    bytesPerValue: 2,
  },
  output: { result: { cacheBytes: "2560" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "artificial-intelligence/kv-cache-token-byte-count",
  title: "Artificial Intelligence: Kv Cache Token Byte Count Tool",
  description:
    "Count exact dense key-plus-value cache bytes for supplied token/layer/KV-head geometry; excludes batching, alignment, metadata, quantization overhead and allocator fragmentation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { cacheBytes: { type: "string" } },
        required: ["cacheBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
