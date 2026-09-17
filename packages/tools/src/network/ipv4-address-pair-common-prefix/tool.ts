import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.ip(i.left, 32),
    b = H.ip(i.right, 32),
    p = H.sharedBits(a, b, 32);
  return H.finish({
    prefix: p,
    address: H.ipText(H.prefix(i.left, p, 32).start, 32),
  });
};
export const example = {
  input: { left: "10.0.0.1", right: "10.0.0.3" },
  output: { result: { prefix: 30, address: "10.0.0.0" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-address-pair-common-prefix",
  title: "IPv4 Address Pair Common Prefix",
  description:
    "Find the exact common leading-bit prefix of two IPv4 addresses; identical addresses yield a /32 ancestor.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
