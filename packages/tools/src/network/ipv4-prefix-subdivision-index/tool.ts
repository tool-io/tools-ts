import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  address: string;
  network: string;
  parentPrefix: number;
  childPrefix: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "network", kind: "string", label: "network" },
  { id: "parentPrefix", kind: "integer", label: "parentPrefix" },
  { id: "childPrefix", kind: "integer", label: "childPrefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.prefix(i.network, i.parentPrefix, 32);
  H.int(i.childPrefix, i.parentPrefix, 32);
  const v = H.ip(i.address, 32);
  H.check(v >= r.start && v <= r.end);
  const size = 1n << BigInt(32 - i.childPrefix);
  return H.finish({
    index: String((v - r.start) / size),
    address: H.ipText((v / size) * size, 32),
    prefix: i.childPrefix,
  });
};
export const example = {
  input: {
    address: "10.0.0.130",
    network: "10.0.0.0",
    parentPrefix: 24,
    childPrefix: 26,
  },
  output: { result: { index: "2", address: "10.0.0.128", prefix: 26 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-subdivision-index",
  title: "IPv4 Prefix Subdivision Index",
  description:
    "Locate a member IPv4 address\u2019s normalized child-prefix index inside an explicit parent at a requested subdivision width.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
