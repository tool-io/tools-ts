import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  left: string;
  leftPrefix: number;
  right: string;
  rightPrefix: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "leftPrefix", kind: "integer", label: "leftPrefix" },
  { id: "right", kind: "string", label: "right" },
  { id: "rightPrefix", kind: "integer", label: "rightPrefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.prefix(i.left, i.leftPrefix, 32),
    b = H.prefix(i.right, i.rightPrefix, 32),
    p = Math.min(
      i.leftPrefix,
      i.rightPrefix,
      H.sharedBits(a.start, b.start, 32),
    ),
    r = H.prefix(H.ipText(a.start, 32), p, 32);
  return H.finish({ address: H.ipText(r.start, 32), prefix: p });
};
export const example = {
  input: {
    left: "10.0.0.0",
    leftPrefix: 25,
    right: "10.0.0.128",
    rightPrefix: 25,
  },
  output: { result: { address: "10.0.0.0", prefix: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-pair-common-ancestor",
  title: "IPv4 Prefix Pair Common Ancestor",
  description:
    "Return the smallest IPv4 prefix containing two complete normalized prefixes; it may include additional addresses beyond their union.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
