import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  pointerPosition: number;
  target: number;
  packetBytes: number;
  labelBoundaries: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "pointerPosition", kind: "integer", label: "pointerPosition" },
  { id: "target", kind: "integer", label: "target" },
  { id: "packetBytes", kind: "integer", label: "packetBytes" },
  { id: "labelBoundaries", kind: "numberList", label: "labelBoundaries" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.packetBytes, 0, 65535);
  H.int(i.pointerPosition, 0, i.packetBytes - 2);
  H.int(i.target, 0, 16383);
  i.labelBoundaries.forEach((x) => H.int(x, 0, i.packetBytes - 1));
  const inBounds = i.target < i.packetBytes,
    backward = i.target < i.pointerPosition,
    labelBoundary = i.labelBoundaries.includes(i.target);
  return H.finish({
    inBounds,
    backward,
    labelBoundary,
    eligible: inBounds && backward && labelBoundary,
  });
};
export const example = {
  input: {
    pointerPosition: 20,
    target: 10,
    packetBytes: 30,
    labelBoundaries: [10],
  },
  output: {
    result: {
      inBounds: true,
      backward: true,
      labelBoundary: true,
      eligible: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/compression-pointer-target-audit",
  title: "DNS Compression Pointer Target Audit",
  description:
    "Audit an explicit DNS compression pointer against packet bounds, backward direction and independently supplied label boundaries; not pointer-chain decoding or loop proof.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inBounds: { type: "boolean" },
          backward: { type: "boolean" },
          labelBoundary: { type: "boolean" },
          eligible: { type: "boolean" },
        },
        required: ["inBounds", "backward", "labelBoundary", "eligible"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
