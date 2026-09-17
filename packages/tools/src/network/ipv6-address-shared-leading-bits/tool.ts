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
  return H.finish({
    bits: H.sharedBits(H.ip(i.left, 128), H.ip(i.right, 128), 128),
  });
};
export const example = {
  input: { left: "::1", right: "::3" },
  output: { result: { bits: 126 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-address-shared-leading-bits",
  title: "IPv6 Address Shared Leading Bits",
  description:
    "Count shared leading bits of two exact IPv6 addresses; identical addresses share all 128 bits and no prefix is inferred from textual abbreviation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
