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
  H.int(i.prefix, 1, 32);
  const r = H.prefix(i.address, i.prefix - 1, 32);
  return H.finish({ address: H.ipText(r.start, 32), prefix: i.prefix - 1 });
};
export const example = {
  input: { address: "10.0.0.2", prefix: 31 },
  output: { result: { address: "10.0.0.0", prefix: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-parent",
  title: "IPv4 Prefix Parent",
  description:
    "Find the immediate normalized parent of an IPv4 prefix; the root /0 has no parent and is rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
