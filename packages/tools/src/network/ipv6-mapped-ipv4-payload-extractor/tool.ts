import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.ip(i.address, 128),
    mapped = v >> 32n === 65535n;
  return H.finish({
    mapped,
    ipv4: mapped ? H.ipText(v & 4294967295n, 32) : null,
  });
};
export const example = {
  input: { address: "::ffff:192.0.2.1" },
  output: { result: { mapped: true, ipv4: "192.0.2.1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-mapped-ipv4-payload-extractor",
  title: "IPv6 Mapped IPv4 Payload Extractor",
  description:
    "Extract an IPv4 payload only from the exact IPv4-mapped IPv6 ::ffff:0:0/96 format; other embeddings are not guessed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
