import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  network: string;
  parentPrefix: number;
  childPrefix: number;
  index: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "network", kind: "string", label: "network" },
  { id: "parentPrefix", kind: "integer", label: "parentPrefix" },
  { id: "childPrefix", kind: "integer", label: "childPrefix" },
  { id: "index", kind: "string", label: "index" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.prefix(i.network, i.parentPrefix, 32);
  H.int(i.childPrefix, i.parentPrefix, 32);
  const index = H.bigint(i.index),
    count = 1n << BigInt(i.childPrefix - i.parentPrefix);
  H.check(index >= 0n && index < count);
  return H.finish({
    address: H.ipText(r.start + index * (1n << BigInt(32 - i.childPrefix)), 32),
    prefix: i.childPrefix,
  });
};
export const example = {
  input: { network: "10.0.0.0", parentPrefix: 24, childPrefix: 26, index: "2" },
  output: { result: { address: "10.0.0.128", prefix: 26 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-subdivision-at-index",
  title: "IPv4 Prefix Subdivision at Index",
  description:
    "Return one normalized IPv4 child prefix at an exact zero-based subdivision index without enumerating the full subdivision.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
