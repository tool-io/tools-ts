import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string; prefix: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "prefix", kind: "integer", label: "prefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.prefix, 1, 128);
  return H.finish({
    address: H.ipText(H.prefix(i.address, i.prefix - 1, 128).start, 128),
    prefix: i.prefix - 1,
  });
};
export const example = {
  input: { address: "::2", prefix: 127 },
  output: {
    result: { address: "0000:0000:0000:0000:0000:0000:0000:0000", prefix: 126 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-prefix-parent",
  title: "IPv6 Prefix Parent",
  description:
    "Find an IPv6 prefix\u2019s immediate normalized parent; /0 is the root and has no parent.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
