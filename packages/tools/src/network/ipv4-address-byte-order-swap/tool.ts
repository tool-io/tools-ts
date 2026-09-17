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
  const v = H.ip(i.address, 32);
  return H.finish({
    address: i.address.split(".").reverse().join("."),
    integer: String(v),
  });
};
export const example = {
  input: { address: "1.2.3.4" },
  output: { result: { address: "4.3.2.1", integer: "16909060" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-address-byte-order-swap",
  title: "IPv4 Address Byte Order Swap",
  description:
    "Reverse the four explicit IPv4 byte lanes while retaining the original exact integer value; not reverse DNS or host/network byte conversion in memory.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
